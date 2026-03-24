const express = require("express");
const AuthController = require("../controllers/AuthController");
const checkUserStatus = require("../middlewares/checkUserStatus");
const { authenticateUser } = require("../middlewares/auth");
const router = express.Router();

router.post("/register",AuthController.register);
router.post("/login",AuthController.login);
router.post("/verify-otp",AuthController.verifyOtp);
router.post("/resent-otp",AuthController.resentOtp);
router.get("/me",authenticateUser,checkUserStatus,AuthController.getProfile)
router.post("/change-password",authenticateUser,checkUserStatus,AuthController.changePassword)
router.post("/logout",authenticateUser,checkUserStatus,AuthController.logout);
module.exports=router;