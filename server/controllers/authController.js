const { AuthService } = require("../services");
const { registerValidation, loginValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class AuthController extends BaseController{
static register = BaseController.asyncHandler(async(req,res)=>{
    const validatedData = BaseController.validateRequest(registerValidation,req.body);
    const result = await AuthService.register(validatedData);
    BaseController.logAction("USER_REGISTER",result.user);
    BaseController.sendSuccess(res,'User registered successfully. Welcome!', result, 201)
});

static login = BaseController.asyncHandler(async (req,res)=>{
    const validationData = BaseController.validateRequest(loginValidation,req.body);
    const result = await AuthService.login(validationData);
    BaseController.logAction("USER_LOGIN",result.user);
    BaseController.sendSuccess(res,"Login Successfull.",result);
})
}
module.exports=AuthController;