const Joi = require("joi");

const commonPatterns = {
    name: Joi.string().label("Name").min(2).max(100).trim().required(),
    email: Joi.string().label("Email").email().lowercase().trim().required(),
    password: Joi.string().label("Password").min(8).max(128).required(),
    objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
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

module.exports = {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    resetPasswordValidation,
    passwordChangeValidation,
    adminLoginValidation,
};
