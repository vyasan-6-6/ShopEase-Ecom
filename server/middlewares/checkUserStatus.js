const logger = require("../utils/logger");
const User = require("../models/User");
const { ErrorFactory } = require("../utils/errors");

const checkUserStatus = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return next();
        }
        const user = await User.findById(userId);

        if (!user) {
            return next(ErrorFactory.notFound("User not Found"));
        }
        if (user.status === "banned") {
            return next(ErrorFactory.authorization("Your account has been banned. Please contact support."));
        }
        next();
    } catch (error) {
    logger.error("Check user status error:", error);
    next(ErrorFactory.database("Error checking user status"));
    }
};


module.exports=checkUserStatus;