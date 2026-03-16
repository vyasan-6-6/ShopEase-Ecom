const logger = require("../utils/logger");
const requestLogger = (req,res,next)=>{
    const startTime = Date.now();
    logger.info(`Incoming request: ${req.method} ${req.orginalUrl} from ${req.ip}`);

    const originalEnd = res.end;//This technique is called function wrapping / monkey patching.
    
    res.end = function(chunk,encoding){
        const duration = Date.now()-startTime;

        logger.info(`Reponse Completed ${req.method} ${req.orginalUrl} - ${req.statusCode} - ${duration}ms`);

        originalEnd.call(this,chunk,encoding);
    }
    next();
}

module.exports = requestLogger;