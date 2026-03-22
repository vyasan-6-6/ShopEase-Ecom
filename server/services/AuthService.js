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

}

module.exports=AuthService;