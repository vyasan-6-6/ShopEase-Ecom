const { adminLoginValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class AdminController extends BaseController {
    static login = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(adminLoginValidation, req.body);
        const adminData = await AdminService(validatedData);
        BaseController.logAction("ADMIN_LOGIN", adminData.admin);
        BaseController.sendSuccess(res, "Admin has been logged in successfully", adminData);
    });
}

module.exports=AdminController;