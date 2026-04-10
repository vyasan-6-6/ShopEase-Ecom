const { UserService } = require("../services");
const { profileUpdateValidation, addressValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class UserController extends BaseController {
    static getProfile = BaseController.asyncHandler(async (req, res) => {
        const result = await UserService.getProfile(req.user.id);
        BaseController.sendSuccess(res, "Profile retrieved successfully", result.user);
    });
    static updateProfile = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(profileUpdateValidation, req.body);
        const { name, phone } = validatedData;
        const result = await UserService.updateProfile(name, phone, req.user.id);
        BaseController.logAction("PROFILE_UPDATE", result.user);
        BaseController.sendSuccess(res, "updateProfile successful", result.user);
    });
    static addAddresses = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(addressValidation, req.body);
        const result = await UserService.addAddresses(req.user.id, validatedData);
        BaseController.logAction("ADD_ADDRESSES", result.user);
        BaseController.sendSuccess(res, "Add addresses successful", result.user);
    });
    static setDefaultAddress = BaseController.asyncHandler(async (req, res) => {
        const { addressId } = req.params;
        const result = await UserService.setDefaultAddress(req.user.id, addressId);
        BaseController.logAction("SET_DEFAULT_ADDRESS", result.user);
        BaseController.sendSuccess(res, "Set default address successfully", result.user);
    });

    static deleteAddress = BaseController.asyncHandler(async (req, res) => {
        const { addressId } = req.params;
        const result = await UserService.deleteAddress(req.user.id, addressId);
        BaseController.logAction("DELETE_ADDRESS", result.user);
        BaseController.sendSuccess(res, "Address deleted successfully", result.user);
    });

    static editAddress = BaseController.asyncHandler(async (req, res) => {
        const { addressId } = req.params;
        const validatedData = BaseController.validateRequest(addressValidation, req.body);
        const result = await UserService.editAddress(req.user.id, addressId, validatedData);
        BaseController.logAction("EDIT_ADDRESS", result.user);
        BaseController.sendSuccess(res, "Address updated successfully", result.user);
    });

    static uploadAvatar = BaseController.asyncHandler(async (req, res) => {
        const result = await UserService.uploadAvatar(req.user.id, req.file?.path);
        BaseController.logAction("AVATAR_UPLOAD", result.user);
        BaseController.sendSuccess(res, "Avatar uploaded successfully", result.user);
    });
}
module.exports = UserController;
