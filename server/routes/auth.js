const express = require("express");
const AuthController = require("../controllers/AuthController");
const checkUserStatus = require("../middlewares/checkUserStatus");
const { authenticateUser } = require("../middlewares/auth");
const { 
    registerRules, 
    loginRules, 
    forgotPasswordRules, 
    resetPasswordRules, 
    changePasswordRules 
} = require("../validation/authValidation");
const { validateRequest } = require("../middlewares/validation"); 
const router = express.Router();

router.post("/register", registerRules, validateRequest, AuthController.register);
router.post("/login",  loginRules, validateRequest, AuthController.login);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/forgot-password", forgotPasswordRules, validateRequest, AuthController.forgotPassword);
router.post("/verify-reset-otp", AuthController.verifyResetOtp);
router.post("/reset-password", resetPasswordRules, validateRequest, AuthController.resetPassword);
router.get("/getProfile", authenticateUser, checkUserStatus, AuthController.getProfile); 
router.post("/change-password", changePasswordRules, validateRequest, authenticateUser, checkUserStatus, AuthController.changePassword);
router.post("/logout", authenticateUser, checkUserStatus, AuthController.logout);
module.exports = router;