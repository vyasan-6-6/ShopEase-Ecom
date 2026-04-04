const User = require("../models/User");
const { ErrorFactory } = require("../utils/errors");

class UserService {
    static async updateProfile(name, phone, userId) {
        const updatedUser = await User.findByIdAndUpdate(userId, { name, phone }, { new: true, runValidators: true });
        if (!updatedUser) {
            throw ErrorFactory.notFound("User not found");
        }
        return {
            user: updatedUser,
        };
    }
}
module.exports = UserService;
