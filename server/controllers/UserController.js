const UserService = require("../services/UserService");
const { profileUpdateValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class UserController extends BaseController {
static updateProfile = BaseController.asyncHandler(async(req,res)=>{
    const validatedData = BaseController.validateRequest(profileUpdateValidation,req.body);
    const {name,phone} = validatedData;
    const result = await UserService.updateProfile(name,phone.req.user.id);
    BaseController.logAction("PROFILE_UPDATE",result.user);
    BaseController.sendSuccess("updateProfile successful",result.user);
})
}