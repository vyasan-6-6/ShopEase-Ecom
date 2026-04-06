const User = require("../models/User");
const { ErrorFactory } = require("../utils/errors");

class UserService {
    static async getProfile(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw ErrorFactory.notFound("User not found");
        }
        if (user.status === "banned") {
            throw ErrorFactory.authorization("Your account has been banned.");
        }
        return { user };
    }
    static async updateProfile(name, phone, userId) {
        const updatedUser = await User.findByIdAndUpdate(userId, { name, phone }, { new: true, runValidators: true });
        if (!updatedUser) {
            throw ErrorFactory.notFound("User not found");
        }
        return {
            user: updatedUser,
        };
    }
    static async addAddresses(userId, addressData) {
        const user = await User.findById(userId);
        if (!user) {
            throw ErrorFactory.notFound("User not found");
        }
        await user.addAddress(addressData);
        
        return {
            user,
        };
    }
}
module.exports = UserService;
