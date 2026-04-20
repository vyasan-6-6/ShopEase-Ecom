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
            //   Already fully verified → reject as duplicate
            if (existingUser.isVerified) {
                throw ErrorFactory.conflict("An account with this email already exists. Please log in.");
            }

            //   Exists but never verified → update details and resend OTP so they can complete registration
            const otp = generateOTP();
            existingUser.password = userData.password; // Update to the latest password provided
            existingUser.name = userData.name;         // Update to the latest name provided
            existingUser.otp = {
                code: hashOTP(otp),
                expiresAt: Date.now() + 10 * 60 * 1000,
                attempts: 0,
                lastSendAt: Date.now(),
            };
            await existingUser.save();
            setImmediate(() => {
                sendOtpEmail(existingUser.email, otp,"verification").catch((err) => {
                    logger.error("OTP resend email failed:", err);
                });
            });
            logger.info(`OTP resent to unverified user: ${existingUser.email}`);
            return {
                user: existingUser,
                message: "A new OTP has been sent to your email. Please verify to complete registration.",
            };
        }

        //  Brand new user → create and send OTP
        const otp = generateOTP();
        const { name, email, password } = userData;
        const user = await User.create({
            name,
            email,
            password,
            otp: {
                code: hashOTP(otp),
                expiresAt: Date.now() + 10 * 60 * 1000,
                attempts: 0,
                lastSendAt: Date.now(),
            },
        });
        setImmediate(() => {
            sendOtpEmail(user.email, otp,"verification").catch((err) => {
                logger.error("OTP email failed:", err);
            });
        });
        logger.info(`New user registered: ${userData.email}`);

        return {
            user: user,
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
            id: user._id,
            email: user.email,
            role: user.role,
        });
        logger.info(`User logged in: ${email}`);

        return {
            user: user,
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
        if (user.otp.expiresAt < Date.now()) {
            throw ErrorFactory.authentication("OTP expired");
        }
        const hashed = hashOTP(otp);
        if (hashed !== user.otp.code) {
            user.otp.attempts += 1;
            await user.save();
            throw ErrorFactory.authentication("Invalid OTP");
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
            user: user,
            token,
        };
    }

    static async resendOtp(email) {
        const user = await User.findOne({ email });
        // Return same message regardless of user existence to prevent email enumeration
        const successMessage = { message: "If an account exists with this email, a new OTP has been sent." };
        
        if (!user) {
            return successMessage;
        }
        if (user.isVerified) {
            throw ErrorFactory.conflict("User already verified");
        }
        if (user.otp?.lastSendAt && Date.now() - user.otp.lastSendAt < 60 * 1000) {
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
        setImmediate(() => {
            sendOtpEmail(user.email, otp,"verification").catch((err) => {
                logger.error("OTP email failed:", err);
            });
        });
        return {
            message: "OTP send Successfully.",
        };
    }

    static async forgotPassword(email) {
        const user = await User.findOne({ email });
        // Always return success message to prevent email enumeration
        const successMessage = { message: "If an account exists with this email, an OTP has been sent." };

        if (!user) {
            return successMessage;
        }

        const otp = generateOTP();
        user.resetPassword = {
            otp: hashOTP(otp),
            expiresAt: Date.now() + 10 * 60 * 1000,
            attempts: 0,
            lastSendAt: Date.now(),
        };
        await user.save();
        await sendOtpEmail(email, otp, "reset");
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
        user.resetPassword.isVerified = true;
        await user.save();
        return {
            message: "OTP verified",
        };
    }

    static async resetPassword(email, newPassword) {
        const user = await User.findOne({ email });
        if (!user || !user.resetPassword) {
            throw ErrorFactory.notFound("Invalid request");
        }
        if (user.resetPassword.expiresAt < Date.now()) {
            throw ErrorFactory.authentication("OTP expired");
        }
        if (!user.resetPassword.isVerified) {
            throw ErrorFactory.authentication("OTP not verified");
        }
        user.password = newPassword; //hashed via pre
        user.resetPassword = undefined;
        await user.save();
        return { message: "Password reset successful" };
    }

    static async getProfile(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw ErrorFactory.notFound("User not found");
        }
        return user;
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
        return user;
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
