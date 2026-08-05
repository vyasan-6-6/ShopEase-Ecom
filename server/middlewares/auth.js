const { ErrorFactory } = require("../utils/errors");
const { verifyUserToken, verifyAdminToken } = require("../utils/jwt");
const AuthService = require("../services/AuthService");

const getTokenFromReq = (req, cookieName = "userToken") => {
  if (req.cookies && req.cookies[cookieName]) {
    return req.cookies[cookieName];
  }
  const authHeader = req.headers.authorization || req.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(" ")[1];
  }
  return null;
};

const authenticateUser = async (req, res, next) => {
  const token = getTokenFromReq(req, "userToken");
  if (!token) {
    return next(ErrorFactory.authentication('Access token required'));
  }

  try {
    const isBlacklisted = await AuthService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return next(ErrorFactory.authentication("Token has been revoked. Please log in again."));
    }

    const decoded = verifyUserToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }
    next();
  } catch (error) {
    next(ErrorFactory.authentication("Invalid or expired token"));
  }
}

const authenticateAdmin = async (req, res, next) => {
  const token = getTokenFromReq(req, "adminToken") || getTokenFromReq(req, "userToken");
  if (!token) {
    return next(ErrorFactory.authentication('Access token required'));
  }
  try {
    const isBlacklisted = await AuthService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return next(ErrorFactory.authentication("Token has been revoked. Please log in again."));
    }

    const decoded = verifyAdminToken(token);
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
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
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
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

const authenticateAnyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ErrorFactory.authentication('Access token required'));
  }
  const token = authHeader.split(" ")[1];

  const isBlacklisted = await AuthService.isTokenBlacklisted(token);
  if (isBlacklisted) {
    return next(ErrorFactory.authentication("Token has been revoked. Please log in again."));
  }

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

const authenticateAnyUserOptional = (req, res, next) => {
  const authHeader = req.headers.authorization || req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyUserToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    return next();
  } catch (error) {
    try {
      const decoded = verifyAdminToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
      return next();
    } catch (adminError) {
      return next();
    }
  }
};

module.exports = {
  authenticateAdmin,
  authenticateAdminOptional,
  authenticateUser,
  authenticateAnyUser,
  authenticateAnyUserOptional,
  requireAdmin
}