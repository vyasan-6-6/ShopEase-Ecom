const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Coupon code is required"],
            unique: true,
            trim: true,
            uppercase: true,
        },
        discountPercent: {
            type: Number,
            required: [true, "Discount percentage is required"],
            min: [1, "Discount must be at least 1%"],
            max: [100, "Discount cannot exceed 100%"],
        },
        expiryDate: {
            type: Date,
            required: [true, "Expiry date is required"],
        },
        minOrderAmount: {
            type: Number,
            default: 0,
            min: [0, "Minimum order amount cannot be negative"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

couponSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Coupon", couponSchema);
