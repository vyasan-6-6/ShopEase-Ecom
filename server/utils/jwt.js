const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const { ErrorFactory } = require("./errors");
const config = require("../config/config");

const generateUserToken = (payload) => {
    try {
        return jwt.sign(payload, config.JWT.USER_SECRET, {expiresIn:config.JWT.EXPIRES_IN});
    } catch (error) {
        logger.error("Error generating user token:", error);
    throw ErrorFactory.authentication("Token generation failed.");
    }
};

const generateAdminToken = (payload)=>{
    try {
        return jwt.sign(payload,config.JWT.ADMIN_SECRET,{expiresIn:config.JWT.EXPIRES_IN});
    } catch (error) {
         logger.error("Error generating admin token:", error);
      throw  ErrorFactory.authentication('Token generation failed.')
    }
}

const verifyUserToken = (token) => {
    try {
        if (!config.JWT.USER_SECRET) {
            throw ErrorFactory.generic("JWT_USER_SECRET not configured");
        }
        return jwt.verify(token,config.JWT.USER_SECRET);
    } catch (error) {
     throw  ErrorFactory.authentication("Token verification failed");
    }
};

const verifyAdminToken = (token)=>{
    try {
      if (!config.JWT.ADMIN_SECRET) {
            throw ErrorFactory.generic("JWT_USER_SECRET not configured");
        }
        return jwt.verify(token,config.JWT.ADMIN_SECRET);
    } catch (error) {
       throw   ErrorFactory.authentication("Token verification failed");
    }
}
module.exports = {
    generateUserToken,
    verifyUserToken,generateAdminToken,verifyAdminToken
};
