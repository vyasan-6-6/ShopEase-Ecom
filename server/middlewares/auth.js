const { ErrorFactory } = require("../utils/errors");
const { verifyUserToken } = require("../utils/jwt");


const authenticateUser = (req,res,next)=>{
const authHeader = req.headers.authorization;
 if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ErrorFactory.authentication('Access token required'));
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyUserToken(token);
    req.user = {
        id:decoded.id,
        email:decoded.email,
        role:decoded.role
    }
    next();
  } catch (error) {
    next(ErrorFactory.authentication("Invalid or expired token"));
  }
}

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(ErrorFactory.authentication('Not authenticated'));
  }

  if (req.user.role !== 'admin') {
    return next(ErrorFactory.authorization('Admin privileges required'));
  }

  next();
};
module.exports = {
    authenticateUser,
    requireAdmin
}