const Joi = require("joi");

const commonPatterns = {
    name: Joi.string().min(2).max(100).trim().required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(8).max(128).required(),
    objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    status:Joi.string().valid("active","banned","inactive"),//this is enum validation
    role:Joi.string().valid("admin","user")
};
