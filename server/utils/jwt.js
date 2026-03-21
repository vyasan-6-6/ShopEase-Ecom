const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const generateUserToken = (payload)=>{
  try {
    return jwt.sign(payload,process.env.JWT_USER_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
  } catch (error) {
       logger.error('Error generating user token:', error);
       throw new Error("Token generation failed.")
  }
}