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

    static error(res, error) {
        const formattedError = ErrorUtils.formatError(error);

        const response = {
            ...formattedError,
            message: formattedError.error.message, // Expose message at top level for frontend
            timestamp: new Date().toISOString(),
            requestId: res.locals.requestId || null,
        };
        return res.status(formattedError.error.statusCode).json(response);
    }

    
  static validationError(res, validationResult) {
    const errors = validationResult.error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message,
      value: detail.context?.value
    }));

  const error = {
    name:"ValidationError",
    details:errors
  }

   return this.error(res,error)
  }

static created(res,message,data=null){
    return this.success(res,message,data,201);
}

static noContent(res){
    return res.status(204).send();
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
}



const sendSuccess = (res,message,data=null,statusCode=200)=>{
    return ResponseFormatter.success(res,message,data,statusCode);
}

const sendError = (res,error)=>{
    return ResponseFormatter.error(res,error);
}


const sendValidationError = (res, validationResult) => {
  return ResponseFormatter.validationError(res, validationResult);
};

module.exports={
    ResponseFormatter,
    sendSuccess,
    sendError,
    sendValidationError
}