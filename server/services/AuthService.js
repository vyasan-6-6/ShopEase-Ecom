const { error } = require("winston");
const User = require("../models/User");
const { ErrorFactory } = require("../utils/errors");
const { generateUserToken } = require("../utils/jwt");
const logger = require("../utils/logger");
const { generateOTP, hashOTP } = require("../utils/otp");
const { sendOtpEmail } = require("../utils/nodemailer");

class AuthService {
    static async register(userData) {
        const existingUser = await User.findByEmail(userData.email);
        if (existingUser) {
            throw ErrorFactory.conflict("User with this email already exists");
        }
        const otp = generateOTP();
        const user = await User.create({
            ...userData,
            otp: {
                code: hashOTP(otp),
                expiresAt: Date.now() + 10 * 60 * 1000, //10min
                lastSendAt: Date.now(),
            },
        });
        await sendOtpEmail(user.email, otp);
        logger.info(`New user registered: ${userData.email}`);

        return {
            user: user.getPublicProfile(),
            message: "OTP sent to your email",
        };
    }

    static async login(credentials) {
        const { email, password } = credentials;
        const user = await User.findByEmail(email);
        if (!user) {
            throw ErrorFactory.authentication("Invalid email or password");
        }
        if (!user.isVerified) {
            throw ErrorFactory.authentication("Please verify your account with OTP.");
        }

        if (user.status === "banned") {
            throw ErrorFactory.authorization("Your account has been banned. Please contact administrator.");
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw ErrorFactory.authentication("Invalid email or password");
        }
        user.lastLogin = new Date();
        await user.save();

        const token = generateUserToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        logger.info(`User logged in: ${email}`);

        return {
            user: user.getPublicProfile(),
            token,
        };
    }

    static async verifyOtp(email, otp) {
        const user = await User.findOne({ email });
        if (!user) {
            throw ErrorFactory.notFound("User not found");
        }
        if (user.isVerified) {
            throw ErrorFactory.conflict("User already existed");
        }

        if (!user.otp || !user.otp.code) {
            throw ErrorFactory.authentication("NO OTP found");
        }
        //  Attempt limit
        if (user.otp.attempts >= 5) {
            throw ErrorFactory.authentication("Too many attempts. Request new OTP");
        }
        const hashed = hashOTP(otp);
        if (hashed !== user.otp.code) {
            user.otp.attempts += 1;
            await user.save();
            throw ErrorFactory.authentication("Invalid OTP");
        }
        if (user.otp.expiresAt < Date.now()) {
            throw ErrorFactory.authentication("OTP expired");
        }

        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        const token = generateUserToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });
        return {
            user: user.getPublicProfile(),
            token,
        };
    }

    static async resentOtp(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw ErrorFactory.notFound("OTP sent if email exists");//prevents email enumeration attacks
        }
        if (user.isVerified) {
            throw ErrorFactory.conflict("User already verified");
        }
        if (user.otp?.lastSendAt && Date.now - user.otp.lastSendAt < 60 * 1000) {
            throw ErrorFactory.authentication("Please wait before requesting another OTP.");
        }

        const otp = generateOTP();
        user.otp = {
            code: hashOTP(otp),
            expiresAt: Date.now() + 10 * 60 * 1000,
            attempts: 0,
            lastSendAt: Date.now(),
        };
        await user.save();
        await sendOtpEmail(email, otp);
        return {
            message: "OTP send Successfully.",
        };
    }

    static async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw ErrorFactory.notFound("User not found");
        }
        const otp = generateOTP();
        user.resetPassword = {
            otp: hashOTP(otp),
            expiresAt: Date.now() + 10 * 60 * 1000,
            attempts: 0,
        };
        await user.save();
        await sendOtpEmail(email, otp);
        return { message: "OTP sent to email" };
    }

    static async verifyResetOtp(email, otp) {
        const user = await User.findOne({ email });
        if (!user || !user.resetPassword) {
            throw ErrorFactory.notFound("Invalid request");
        }
        if (user.resetPassword.attempts >= 5) {
            throw ErrorFactory.authentication("Too many attempts");
        }
        if (user.resetPassword.expiresAt < Date.now()) {
            throw ErrorFactory.authentication("OTP expired");
        }

        const hashed = hashOTP(otp);
        if (hashed !== user.resetPassword.otp) {
            user.resetPassword.attempts += 1;
            await user.save();
            throw ErrorFactory.authentication("Invalid OTP");
        }
        return {
            message: "OTP verified",
        };
    }

    static async resetPassword(email, newPassword) {
        const user = await User.findOne({ email });
        if (!user || !user.resetPassword) {
            throw new NotFoundError("Invalid request");
        }
        if (user.resetPassword.expiresAt < Date.now()) {
            throw ErrorFactory.authentication("OTP expired");
        }
        user.password = newPassword;
        user.resetPassword = undefined;
        await user.save();
        return { message: "Password reset successful" };
    }

    static async getProfile(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw ErrorFactory.notFound("User not found");
        }
        return user.getPublicProfile();
    }

    static async updateProfile(userId, updateData) {
        delete updateData.password;
        delete updateData.role;
        delete updateData.status;
        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true, //Return updated document,default:false
            runValidators: true, //Apply schema validation on update,default:false
        });
        if (!user) {
            throw ErrorFactory.notFound("User not found");
        }
        logger.info(`Profile updated:${user.email}`);
        return user.getPublicProfile();
    }

    static async changePassword(userId, passwordData) {
        const { currentPassword, newPassword } = passwordData;
        //include password
        const user = await User.findById(userId).select("+password");
        if (!user) {
            throw ErrorFactory.notFound("user not found");
        }
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            throw ErrorFactory.authentication("Current password is incorrect.");
        }
        user.password = newPassword;
        await user.save();
        logger.info(`Password changed for user:${user.email}`);
        return true;
    }
}

module.exports = AuthService;
