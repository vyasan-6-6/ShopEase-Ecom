const User = require("../models/User");
const { uploadToCloudinary } = require("../utils/cloudinary");
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
        const updatedUser = await User.findByIdAndUpdate(userId, { name, phone }, { returnDocument: 'after', runValidators: true });
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

    static async setDefaultAddress(userId, addressId) {
        const user = await User.findById(userId);
        if (!user) {
            throw ErrorFactory.notFound("User not found");
        }
        await user.setDefaultAddress(addressId);
        return { user };
    }

    static async deleteAddress(userId, addressId) {
        const user = await User.findById(userId);
        if (!user) throw ErrorFactory.notFound("User not found");

        await user.deleteAddress(addressId);
        return { user };
    }

    static async editAddress(userId, addressId, addressData) {
        const user = await User.findById(userId);
        if (!user) throw ErrorFactory.notFound("User not found");

        await user.editAddress(addressId, addressData);
        return { user };
    }

    static async uploadAvatar(userId, localFilePath) {
        if (!localFilePath) {
            throw ErrorFactory.validation("No image file provided");
        }

        const uploadResponse = await uploadToCloudinary(localFilePath);

        if (!uploadResponse || !uploadResponse.secure_url) {
            throw ErrorFactory.generic("Failed to upload image to cloud storage");
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: uploadResponse.secure_url },
            { returnDocument: "after", runValidators: true },
        );
        return {
            user: updatedUser,
        };
    }
}
module.exports = UserService;
