import * as yup from "yup";
   
export const couponSchema = yup.object().shape({
    code: yup.string()
        .required("Coupon code is required")
        .min(3, "Must be at least 3 characters")
        .uppercase(),
    discountPercent: yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required("Discount percentage is required")
        .min(1, "Minimum discount is 1%")
        .max(100, "Maximum discount is 100%"),
    expiryDate: yup.date()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .required("Expiry date is required")
        .min(new Date(), "Expiry date must be in the future"),
    minOrderAmount: yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .min(0, "Cannot be negative")
        .default(0),
    isActive: yup.boolean().default(true),
});
