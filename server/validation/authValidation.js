const { body } = require('express-validator');
const registerRules = [
    // Must be a valid email
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    
    // Password must be at least 8 chars and contain a number
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/\d/).withMessage('Password must contain a number'),
        
    // Name cannot be empty and HTML tags are stripped out to prevent XSS
    body('name').notEmpty().withMessage('Name is required').trim().escape()
];
const productRules = [
    body('price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
    body('stock').isInt({ min: 0 }).withMessage('Stock cannot be negative')
];

const loginRules = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
];

const forgotPasswordRules = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail()
];

const resetPasswordRules = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/\d/).withMessage('Password must contain a number')
];

const changePasswordRules = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/\d/).withMessage('Password must contain a number')
];

const productUpdateRules = [
    body('price').optional().isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock cannot be negative')
];

module.exports = {
    registerRules,
    productRules,
    loginRules,
    forgotPasswordRules,
    resetPasswordRules,
    changePasswordRules,
    productUpdateRules
};