const { AuthService } = require("../services");
const {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    passwordChangeValidation,
    resetPasswordValidation,
} = require("../utils/validation");
const BaseController = require("./BaseController");

const { OAuth2Client } = require("google-auth-library");
const config = require("../config/config");
const { ErrorFactory } = require("../utils/errors");
const googleClient = new OAuth2Client(config.GOOGLE.CLIENT_ID);

const setAuthCookie = (res, token, isAdmin = false) => {
    if (!token) return;
    const cookieName = isAdmin ? "adminToken" : "userToken";
    const isProd = process.env.NODE_ENV === "production";
    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 8 * 24 * 60 * 60 * 1000, // 8 days
    });
};

const clearAuthCookies = (res) => {
    const isProd = process.env.NODE_ENV === "production";
    const options = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    };
    res.clearCookie("userToken", options);
    res.clearCookie("adminToken", options);
};

class AuthController extends BaseController {
    static register = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(registerValidation, req.body);
        const result = await AuthService.register(validatedData);
        if (result.token) setAuthCookie(res, result.token, result.user?.role === "admin");
        BaseController.logAction("USER_REGISTER", result.user);
        BaseController.sendSuccess(res, "User registered successfully. Welcome!", result, 201);
    });

    static login = BaseController.asyncHandler(async (req, res) => {
        const validationData = BaseController.validateRequest(loginValidation, req.body);
        const result = await AuthService.login(validationData);
        if (result.token) setAuthCookie(res, result.token, result.user?.role === "admin");
        BaseController.logAction("USER_LOGIN", result.user);
        BaseController.sendSuccess(res, "Login Successfull.", result);
    });

    static googleAuth = BaseController.asyncHandler(async (req, res) => {
        const { credential } = req.body;
        if (!credential) {
            throw ErrorFactory.badRequest("Google credential is required", 400);
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: config.GOOGLE.CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const result = await AuthService.googleLogin(payload);
        if (result.isNewUser) {
            return BaseController.sendSuccess(res, "Please provide a password to complete registration.", result);
        }

        if (result.token) setAuthCookie(res, result.token, result.user?.role === "admin");
        BaseController.logAction("USER_LOGIN_GOOGLE", result.user);
        BaseController.sendSuccess(res, "Login Successfull.", result);
    });

    static googleRegister = BaseController.asyncHandler(async (req, res) => {
        const { credential, password } = req.body;
        if (!credential || !password) {
            throw ErrorFactory.badRequest("Google credential and password are required", 400);
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: config.GOOGLE.CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const result = await AuthService.googleRegister(payload, password);
        if (result.token) setAuthCookie(res, result.token, result.user?.role === "admin");
        BaseController.logAction("USER_REGISTER_GOOGLE", result.user);
        BaseController.sendSuccess(res, "Registration Successfull.", result);
    });

    static verifyOtp = BaseController.asyncHandler(async (req, res) => {
        const { email, otp } = req.body;
        const result = await AuthService.verifyOtp(email, otp);
        BaseController.sendSuccess(res, "Account verified successfully", result);
    });

    static resendOtp = BaseController.asyncHandler(async (req, res) => {
        const { email } = req.body;
        const result = await AuthService.resendOtp(email);
        BaseController.sendSuccess(res, result.message);
    });

    static forgotPassword = BaseController.asyncHandler(async (req, res) => {
        const { email } = req.body;
        console.log("email from forgot :", email);

        const result = await AuthService.forgotPassword(email);
        BaseController.sendSuccess(res, result.message);
    });

    static verifyResetOtp = BaseController.asyncHandler(async (req, res) => {
        const { email, otp } = req.body;
        const result = await AuthService.verifyResetOtp(email, otp);
        BaseController.sendSuccess(res, result.message);
    });
    static resetPassword = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(resetPasswordValidation, req.body);
        const { email, newPassword } = validatedData; 
        const result = await AuthService.resetPassword(email, newPassword);
        BaseController.sendSuccess(res, result.message);
    })
    static getProfile = BaseController.asyncHandler(async (req, res) => {
        const user = await AuthService.getProfile(req.user.id);
        BaseController.sendSuccess(res, "Profile retrieved successfully", user);
    });

    static updateProfile = BaseController.asyncHandler(async (req, res) => {//in usercontroller
        const validatedData = BaseController.validateRequest(profileUpdateValidation, req.body);
        const user = await AuthService.updateProfile(req.user.id, validatedData);
        BaseController.logAction("PROFILE_UPDATE", user);
        BaseController.sendSuccess(res, "Profile updated successfully", { user });
    });

    static changePassword = BaseController.asyncHandler(async (req, res) => {//in usercontroller
        const validationData = BaseController.validateRequest(passwordChangeValidation, req.body);
        await AuthService.changePassword(req.user.id, validationData);

        BaseController.logAction("PASSWORD_CHANGE", req.user);
        BaseController.sendSuccess(res, "Password changed successfully");
    });

    static logout = BaseController.asyncHandler(async (req, res) => {
        const token = req.cookies?.userToken || req.cookies?.adminToken || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
        if (token) {
            await AuthService.blacklistToken(token);
        }

        clearAuthCookies(res);

        BaseController.logAction("USER_LOGOUT", req.user);
        BaseController.sendSuccess(res, "Logged out successfull");
    });
}
module.exports = AuthController;
