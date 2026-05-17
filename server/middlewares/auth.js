const { ErrorFactory } = require("../utils/errors");
const { verifyUserToken,verifyAdminToken } = require("../utils/jwt");


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

const authenticateAdmin=(req,res,next)=>{
  const authHeader = req.get('Authorization');
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ErrorFactory.authentication('Access token required'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded  = verifyAdminToken(token);
    req.admin = {
      id:decoded.id,
      email:decoded.email,
      role:decoded.role,
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
const authenticateAdminOptional = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader ||!authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAdminToken(token);
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
   
  }
  next();
};

const authenticateAnyUser = (req, res, next) => {
  const authHeader = req.headers.authorization || req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ErrorFactory.authentication('Access token required'));
  }
  const token = authHeader.split(" ")[1];

  // Try user token first
  try {
    const decoded = verifyUserToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    return next();
  } catch (error) {
    // If user token fails, try admin token
    try {
      const decoded = verifyAdminToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
      return next();
    } catch (adminError) {
      next(ErrorFactory.authentication("Invalid or expired token"));
    }
  }
};

module.exports = {
  authenticateAdmin,
  authenticateAdminOptional,
  authenticateUser,
  authenticateAnyUser,
  requireAdmin
}