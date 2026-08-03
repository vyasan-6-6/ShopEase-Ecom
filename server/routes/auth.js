const express = require("express");
const AuthController = require("../controllers/AuthController");
const checkUserStatus = require("../middlewares/checkUserStatus");
const { authenticateUser } = require("../middlewares/auth");
const createRedisRateLimiter = require("../middlewares/redisRateLimiter");
const { 
    registerRules, 
    loginRules, 
    forgotPasswordRules, 
    resetPasswordRules, 
    changePasswordRules 
} = require("../validation/authValidation");
const { validateRequest } = require("../middlewares/validation"); 
const router = express.Router();

const authRateLimiter = createRedisRateLimiter({ windowInSeconds: 900, maxRequests: 10, prefix: "auth" });
const otpRateLimiter = createRedisRateLimiter({ windowInSeconds: 900, maxRequests: 5, prefix: "otp" });

router.post("/register", authRateLimiter, registerRules, validateRequest, AuthController.register);
router.post("/login", authRateLimiter, loginRules, validateRequest, AuthController.login);
router.post("/verify-otp", otpRateLimiter, AuthController.verifyOtp);
router.post("/resend-otp", otpRateLimiter, AuthController.resendOtp);
router.post("/forgot-password", authRateLimiter, forgotPasswordRules, validateRequest, AuthController.forgotPassword);
router.post("/verify-reset-otp", otpRateLimiter, AuthController.verifyResetOtp);
router.post("/reset-password", authRateLimiter, resetPasswordRules, validateRequest, AuthController.resetPassword);
router.get("/getProfile", authenticateUser, checkUserStatus, AuthController.getProfile); 
router.post("/change-password", changePasswordRules, validateRequest, authenticateUser, checkUserStatus, AuthController.changePassword);
router.post("/logout", authenticateUser, checkUserStatus, AuthController.logout);
router.post("/google", authRateLimiter, AuthController.googleAuth);
router.post("/google/register", authRateLimiter, AuthController.googleRegister);
module.exports = router;