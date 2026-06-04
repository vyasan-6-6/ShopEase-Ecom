const { CouponService } = require("../services");
const BaseController = require("./BaseController");
const { couponValidation, validateCouponRequest, updateValidation } = require("../utils/validation");

class CouponController extends BaseController {
    // POST /api/coupon
    static create = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(couponValidation, req.body);
        const coupon = await CouponService.createCoupon(validatedData);
        BaseController.logAction("COUPON_CREATE", req.admin, { couponId: coupon.id });
        BaseController.sendSuccess(res, "Coupon created successfully", { coupon }, 201);
    });

    // GET /api/coupon
    static getAll =  BaseController.asyncHandler(async (req, res) => {
        const coupons = await CouponService.getAllCoupons();
        BaseController.sendSuccess(res, "Coupons retrieved successfully", { coupons });
    });

    // PUT /api/coupon/:id
    static update = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(updateValidation, req.body);
        const coupon = await CouponService.updateCoupon(req.params.id, validatedData);
        BaseController.logAction("COUPON_UPDATE", req.admin, { couponId: coupon.id });
        BaseController.sendSuccess(res, "Coupon updated successfully", { coupon });
    });

    // DELETE /api/coupon/:id
    static delete = BaseController.asyncHandler(async (req, res) => {
        const coupon = await CouponService.deleteCoupon(req.params.id);
        BaseController.logAction("COUPON_DELETE", req.admin, { couponId: coupon.id });
        BaseController.sendSuccess(res, "Coupon deleted successfully", { coupon });
    });

    // POST /api/coupon/validate
    static validate = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(validateCouponRequest, req.body);
        const coupon = await CouponService.validateCoupon(validatedData.code, validatedData.cartTotal);
        BaseController.sendSuccess(res, "Coupon is valid", { coupon });
    });
}

module.exports = CouponController;
