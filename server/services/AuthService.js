const User = require("../models/User");
const { ErrorFactory } = require("../utils/errors");
const { generateUserToken } = require("../utils/jwt");
const logger = require("../utils/logger");

class AuthService {
    static async register(userData) {
        try {
            const existingUser = await User.findByEmail(userData.email);
            if (existingUser) {
                throw ErrorFactory.conflict("User with this email already exists");
            }

            const user = new User(userData);
            await user.save();
            logger.info(`New user registered: ${userData.email}`);

            return {
                user: user.getPublicProfile(),
            };
        } catch (error) {
            logger.error("Registration error:", error);
            throw error;
        }
    }

    static async login(credentials) {
        try {
            const { email, password } = credentials;
            const user = await User.findByEmail(email);
            if (!user) {
                throw ErrorFactory.validation("Invalid email or password");
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
        } catch (error) {
            logger.error("Login error:", error);
            throw error;
        }
    }
}


module.exports=AuthService;