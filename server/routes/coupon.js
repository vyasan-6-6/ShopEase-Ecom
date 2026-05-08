const express = require("express");
const CouponController = require("../controllers/CouponController");
const { authenticateAdmin, authenticateAnyUser } = require("../middlewares/auth");

const router = express.Router();

// Public/User Routes
router.post("/validate", authenticateAnyUser, CouponController.validate);

// Admin-Protected Routes
router.post("/", authenticateAdmin, CouponController.create);
router.get("/", authenticateAdmin, CouponController.getAll);
router.put("/:id", authenticateAdmin, CouponController.update);
router.delete("/:id", authenticateAdmin, CouponController.delete);

module.exports = router;
