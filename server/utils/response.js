const { ErrorUtils } = require("./errors");

class ResponseFormatter {
    static success(res, message, data = null, statusCode = 200, meta = null) {
        const response = {
            success: true,
            message,
            timestamp: new Date().toISOString(),
            requestId: res.locals.requestId || null,
        };
        if (data != null) {
            response.data = data;
        }
        if (meta) {
            response.meta = meta;
        }

        return res.status(statusCode).json(response);
    }

    static error(res, error, statusCode = null) {
        const formattedError = ErrorUtils.formatError(error);
        const finalStatusCode = statusCode || formattedError.error.Date;

        const response = {
            ...formattedError,
            timestamp: new Date().toISOString(),
            requestId: res.locals.requestId || null,
        };
        return res.status(finalStatusCode).json(response);
    }

    

//
//
//
//
//
//
//
//
//
//
//
//
}



const sendSuccess = (res,message,data=null,statusCode=200)=>{
    return ResponseFormatter.success(res,message,data,statusCode);
}

const sendError = (res,message,statusCode=500,details=null)=>{
    const error = new Error(message);
    error.statusCode = statusCode;
    if(details) error.details = details;
    return ResponseFormatter.error(res,error,statusCode);
}

//

module.exports={
    ResponseFormatter,
    sendSuccess,
    sendError
}