const Coupon = require("../models/Coupon");
const { ErrorFactory } = require("../utils/errors");

class CouponService {
    static async createCoupon(data) {
        // Check if coupon already exists
        const existingCoupon = await Coupon.findOne({ code: data.code.toUpperCase() });
        if (existingCoupon) {
            throw ErrorFactory.conflict("Coupon code already exists");
        }

        const coupon = new Coupon(data);
        await coupon.save();
        return coupon;
    }

    static async getAllCoupons() {
        return await Coupon.find().sort({ createdAt: -1 });//descending order,newest first
    }

    static async updateCoupon(id, data) {
        if (data.code) {
            const existing = await Coupon.findOne({ code: data.code.toUpperCase(), _id: { $ne: id } });
            if (existing) throw ErrorFactory.conflict("Coupon code already exists");
        }
         
        const coupon = await Coupon.findByIdAndUpdate(id, {$set: data}, { returnDocument: "after", runValidators: true });
        if (!coupon) throw ErrorFactory.notFound("Coupon not found");
        return coupon;
    }

    static async deleteCoupon(id) {
        const coupon = await Coupon.findByIdAndDelete(id);
        if (!coupon) throw ErrorFactory.notFound("Coupon not found");
        return coupon;
    }

    static async validateCoupon(code, cartTotal) {
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        
        if (!coupon) throw ErrorFactory.notFound("Invalid coupon code");
        if (!coupon.isActive) throw ErrorFactory.badRequest("This coupon is no longer active");
        if (new Date() > coupon.expiryDate) throw ErrorFactory.badRequest("This coupon has expired");
        if (cartTotal < coupon.minOrderAmount) {
            throw ErrorFactory.badRequest(`Minimum order amount of $${coupon.minOrderAmount} required for this coupon`);
        }

        return coupon;
    }
}

module.exports = CouponService;
 