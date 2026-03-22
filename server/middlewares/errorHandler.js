const { ErrorFactory, ErrorUtils } = require("../utils/errors");
const logger = require("../utils/logger");
const { sendError } = require("../utils/response");


const errorHandler = (err, req, res, next) => {
    
    ErrorUtils.logError(err,logger, {
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
    });
    let  error = err;
    
  if (err.name === "CastError") {
    error = ErrorFactory.notFound("Resource not found");
  }

  if (err.name === "MongoServerError" && err.code === 11000) {
    const fields = Object.keys(err.keyValue);
    error = ErrorFactory.conflict(`${fields.join(", ")} already exists`);
  }

    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((val) => ({
            field: val.path,
            message: val.message,
        }));
        
        error=ErrorFactory.validation("Validation failed"),errors
    }

   if (err.name === "JsonWebTokenError") {
    error = ErrorFactory.authentication("Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    error = ErrorFactory.authentication("Token expired");
  }

  //  Final response (single pipeline)
  return sendError(res, error);
};

const notFound = (req, res, next) => {
  const error = ErrorFactory.notFound(`Route ${req.originalUrl} not found`);
    logger.warn(error.message, {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });
     return sendError(res,error);
};

module.exports = {
    errorHandler,
    notFound,
};
