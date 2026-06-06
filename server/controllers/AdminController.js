const { AdminService } = require("../services");
const { adminLoginValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class AdminController extends BaseController {
    static login = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(adminLoginValidation, req.body);
        const adminData = await AdminService.login(validatedData);
        BaseController.logAction("ADMIN_LOGIN", adminData.admin);
        BaseController.sendSuccess(res, "Admin has been logged in successfully", adminData);
    });

    static getProfile = BaseController.asyncHandler(async (req, res) => {
        const adminData = await AdminService.getProfile(req.admin.id);
        BaseController.logAction('GET_PROFILE', adminData.admin)
        BaseController.sendSuccess(res, 'Admin profile fetched successfully', adminData);
    })

    static updateProfile = BaseController.asyncHandler(async (req, res) => {
        const adminData = await AdminService.updateProfile(req.admin.id, req.body);
        BaseController.logAction('UPDATE_PROFILE', adminData.admin)
        BaseController.sendSuccess(res, 'Admin profile updated successfully', adminData);
    })

    static getDashboardStats = BaseController.asyncHandler(async (req, res) => {
        const { days } = req.query;
        const statsData = await AdminService.getDashboardStats(days);
        BaseController.sendSuccess(res, 'Dashboard stats fetched successfully', statsData);
    })
}

module.exports = AdminController;