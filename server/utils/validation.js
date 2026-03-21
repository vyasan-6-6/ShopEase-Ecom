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
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)//These are lookaheads (?=) They don’t consume characters,They just check if condition exists anywhere
    .required()
    .messages({
        "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    });


const registerValidation = Joi.object({
  name: commonPatterns.name.messages(customMessages),
  email: commonPatterns.email.messages(customMessages),
  password: commonPatterns.password.messages(customMessages)
});
 
//
//
//
//
//
//

module.exports={
    registerValidation,
    
}