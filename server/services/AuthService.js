const User = require("../models/User");
const { ErrorFactory } = require("../utils/errors");
const { generateUserToken } = require("../utils/jwt");
const logger = require("../utils/logger");

class AuthService {
    static async register(userData) {
        const existingUser = await User.findByEmail(userData.email);
        if (existingUser) {
            throw ErrorFactory.conflict("User with this email already exists");
        }

        const user = await User.create(userData);
        console.log("user in services:",userData)
        await user.save();
        logger.info(`New user registered: ${userData.email}`);

        return {
            user: user.getPublicProfile(),
        };
    }

    static async login(credentials) {
        const { email, password } = credentials;
        const user = await User.findByEmail(email);
        if (!user) {
            throw ErrorFactory.authentication("Invalid email or password");
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

    static async getProfile(userId){

    const user = await User.findById(userId);
    if(!user){
        throw ErrorFactory.notFound("User not found");
    }
    return user.getPublicProfile();

    }

    static async updateProfile(userId,updateData){
        delete updateData.password;
        delete updateData.role;
        delete updateData.status;
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            {new:true//Return updated document,default:false
                ,runValidators:true//Apply schema validation on update,default:false
            }
        );
        if(!user){
            throw ErrorFactory.notFound("User not found");
        }
        logger.info(`Profile updated:${user.email}`);
        return user.getPublicProfile();
    }


    static async changePassword(userId,passwordData){
        const {currentPassword,newPassword} = passwordData;
        //include password 
        const user = await User.findById(userId).select("+password");
        if(!user){
            throw ErrorFactory.notFound("user not found");
        }
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if(!isCurrentPasswordValid){
            throw ErrorFactory.authentication("Current password is incorrect.");
        }
        user.password = newPassword;
        await user.save();
        logger.info(`Password changed for user:${user.email}`);
        return true;
    }
}



module.exports = AuthService;
