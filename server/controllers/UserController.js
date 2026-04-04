 const {UserService} = require("../services")
const { profileUpdateValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class UserController extends BaseController {
    static getProfile = BaseController.asyncHandler(async (req,res)=>{
       const result = await UserService.getProfile(req.user.id);
        BaseController.sendSuccess(res, "Profile retrieved successfully", result.user);
    })
    static updateProfile = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(profileUpdateValidation, req.body);
        const { name, phone } = validatedData;
        const result = await UserService.updateProfile(name, phone, req.user.id);
        BaseController.logAction("PROFILE_UPDATE", result.user);
        BaseController.sendSuccess(res, "updateProfile successful", result.user);
    });
}
module.exports = UserController;
