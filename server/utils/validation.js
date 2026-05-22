const Joi = require("joi");

const commonPatterns = {
    name: Joi.string().label("Name").min(2).max(100).trim().required(),
    email: Joi.string().label("Email").email().lowercase().trim().required(),
    password: Joi.string().label("Password").trim().min(8).max(128).required(),
    objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),//regular expression for validating mongoDB ObjectIds
    status: Joi.string().valid("active", "banned", "inactive"), //this is enum validation
    role: Joi.string().valid("admin", "user"),
};

const customMessages = {
    "string.min": "{#label} must be at least {#limit} characters long",
    "string.max": "{#label} cannot exceed {#limit} characters",
    "string.email": "Please provide a valid email address",
    "any.required": "{#label} is required",
    "any.only": "{#label} must be one of: {#valids}",
    "string.pattern.base": "{#label} format is invalid",
};

const strongPasswordValidation = Joi.string()
    .label("Password")
    .trim()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/) //These are lookaheads (?=) They don’t consume characters,They just check if condition exists anywhere
    .required()
    .messages({
        "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    });

const registerValidation = Joi.object({
    name: commonPatterns.name.messages(customMessages),
    email: commonPatterns.email.messages(customMessages),
    password: commonPatterns.password.messages(customMessages),
});

const loginValidation = Joi.object({
    email: commonPatterns.email.messages(customMessages),
    password: Joi.string().label("Password").trim().required().messages(customMessages),
});

const adminLoginValidation = loginValidation;

const resetPasswordValidation = Joi.object({
    email: commonPatterns.email.messages(customMessages),
    newPassword: commonPatterns.password.messages({
        ...customMessages,
        "string.min": "New password must be at least 8 characters long",
    }),
});

const profileUpdateValidation = Joi.object({
    name: commonPatterns.name.messages(customMessages),
    phone: Joi.string()
        .pattern(/^\+?[\d\s\-\(\)]+$/)
        .optional()
        .messages({
            "string.pattern.base": "Please provide a valid phone number",
        }),
    bio: Joi.string().max(500).optional(),
    avatar: Joi.string().uri().optional(),
});

const passwordChangeValidation = Joi.object({
    currentPassword: Joi.string().required().messages(customMessages),
    newPassword: commonPatterns.password.messages({
        ...customMessages,
        "string.min": "New password must be at least 8 characters long",
    }),
    confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "Password confirmation does not match new password",
            "any.required": "Password confirmation is required",
        })
        .strip(), //strip()=This removes confirmPassword after validation
});


const addressValidation = Joi.object({
    label: Joi.string().valid("home", "work", "other").optional(),
    street: Joi.string().required().messages(customMessages),
    city: Joi.string().required().messages(customMessages),
    state: Joi.string().required().messages(customMessages),
    zipCode: Joi.string().required().messages(customMessages),
    country: Joi.string().required().messages(customMessages),
    isDefault: Joi.boolean().optional()
}).required();

const categoryValidation = Joi.object({
    name: commonPatterns.name.messages(customMessages),
    description: Joi.string().max(500).optional().allow(""),//allow means empty string is also valid
    status: Joi.string().valid("active", "inactive").optional(),
});

const productValidation = Joi.object({
    name: commonPatterns.name.messages(customMessages),
    description: Joi.string().max(2000).required().messages(customMessages),
    price: Joi.number().min(0).required().messages(customMessages),
    compareAtPrice: Joi.number().min(0).optional().allow(null),
    category: commonPatterns.objectId.required().messages(customMessages),
    stock: Joi.number().min(0).required().messages(customMessages),
    images: Joi.array().items(Joi.string()).optional(),//this means array of strings
    status: Joi.string().valid("active", "inactive", "draft").optional(),
});

const addToCartValidation = Joi.object({
    productId: commonPatterns.objectId.required().messages({
        ...customMessages,
        "string.pattern.base": "Invalid Product ID format",
    }),
    quantity: Joi.number().min(1).default(1).messages(customMessages),
});

const updateQuantityValidation = Joi.object({
    productId: commonPatterns.objectId.required().messages({
        ...customMessages,
        "string.pattern.base": "Invalid Product ID format",
    }),
    quantity: Joi.number().min(1).required().messages(customMessages),
});

const couponValidation = Joi.object({
    code: Joi.string().min(3).max(20).uppercase().trim().required().messages(customMessages),
    discountPercent: Joi.number().min(1).max(100).required().messages(customMessages),
    expiryDate: Joi.date().iso().greater("now").required().messages({
        ...customMessages,
        "date.greater": "Expiry date must be in the future",
        "date.format": "Expiry date must be a valid ISO date",
    }),
    minOrderAmount: Joi.number().min(0).optional().messages(customMessages),
    isActive: Joi.boolean().optional(),
});
 const updateValidation = Joi.object({
            code: Joi.string().min(3).max(20).uppercase().trim().optional(),
            discountPercent: Joi.number().min(1).max(100).optional(),
            expiryDate: Joi.date().iso().greater("now").optional(),
            minOrderAmount: Joi.number().min(0).optional(),
            isActive: Joi.boolean().optional(),
        });
        

const validateCouponRequest = Joi.object({
    code: Joi.string().uppercase().trim().required().messages(customMessages),
    cartTotal: Joi.number().min(0).required().messages(customMessages),
});

const reviewValidation = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages(customMessages),
    comment: Joi.string().min(5).max(1000).trim().required().messages(customMessages),
});

module.exports = {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    resetPasswordValidation,
    passwordChangeValidation,
    adminLoginValidation,
    addressValidation,
    categoryValidation,
    productValidation,
    addToCartValidation,
    updateQuantityValidation,
    couponValidation,
    validateCouponRequest,
    updateValidation,
    reviewValidation
};
