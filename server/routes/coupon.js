const express = require("express");
const CouponController = require("../controllers/CouponController");
const { authenticateAdmin, authenticateAnyUser, authenticateAdminOptional } = require("../middlewares/auth");

const router = express.Router();

// Public/User Routes
router.post("/validate", authenticateAnyUser, CouponController.validate);
router.get("/", authenticateAdminOptional, CouponController.getAll);

// Admin-Protected Routes
router.post("/", authenticateAdmin, CouponController.create);
router.put("/:id", authenticateAdmin, CouponController.update);
router.delete("/:id", authenticateAdmin, CouponController.delete);

module.exports = router;
