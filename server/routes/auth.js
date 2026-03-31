const express = require("express");
const AuthController = require("../controllers/AuthController");
const checkUserStatus = require("../middlewares/checkUserStatus");
const { authenticateUser } = require("../middlewares/auth");
const router = express.Router();

router.post("/register",AuthController.register);
router.post("/login",AuthController.login);
router.post("/verify-otp",AuthController.verifyOtp);
router.post("/resent-otp",AuthController.resendOtp);
router.post("/forgot-password",AuthController.forgotPassword);
router.post("/verify-reset-otp",AuthController.verifyResetOtp);
router.put("/reset-password",AuthController.resetPassword);
router.get("/me",authenticateUser,checkUserStatus,AuthController.getProfile);//in userRoute
router.post("/change-password",authenticateUser,checkUserStatus,AuthController.changePassword)//in userRoute
router.post("/logout",authenticateUser,checkUserStatus,AuthController.logout);
module.exports=router;