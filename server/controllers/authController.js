const { AuthService } = require("../services");
const {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    passwordChangeValidation,
    resetPasswordValidation,
} = require("../utils/validation");
const BaseController = require("./BaseController");

class AuthController extends BaseController {
    static register = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(registerValidation, req.body);
        console.log(req.body);

        const result = await AuthService.register(validatedData);
        BaseController.logAction("USER_REGISTER", result.user);
        BaseController.sendSuccess(res, "User registered successfully. Welcome!", result, 201);
    });

    static login = BaseController.asyncHandler(async (req, res) => {
        const validationData = BaseController.validateRequest(loginValidation, req.body);
        const result = await AuthService.login(validationData);
        BaseController.logAction("USER_LOGIN", result.user);
        BaseController.sendSuccess(res, "Login Successfull.", result);
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
        console.log("email from forgot :",email);
        
        const result = await AuthService.forgotPassword(email);
        BaseController.sendSuccess(res, result.message);
    });

    static verifyResetOtp = BaseController.asyncHandler(async (req, res) => {
        const { email, otp } = req.body;
        const result = await AuthService.verifyResetOtp(email, otp);
        BaseController.sendSuccess(res, result.message);
    });
    static resetPassword = BaseController.asyncHandler(async (req,res)=>{
        const validatedData = BaseController.validateRequest(resetPasswordValidation,req.body); 
        const {email,newPassword} = validatedData;
         
        
        const result = await AuthService.resetPassword(email,newPassword);
         BaseController.sendSuccess(res,result.message);
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
        BaseController.logAction("USER_LOGOUT", req.user);
        BaseController.sendSuccess(res, "Logged out successfull");
    });
}
module.exports = AuthController;
