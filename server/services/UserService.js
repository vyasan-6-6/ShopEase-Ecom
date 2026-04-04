const User = require("../models/User");

class UserService {
    static async updateProfile(name, phone, userId) {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {  name,
                phone, },
            { new: true, runValidators: true },
        );
        if (!updatedUser) {
        throw ErrorFactory.notFound("User not found");
    }
    }
    
}
module.exports = UserService;
