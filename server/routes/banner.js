const express = require("express");
const BannerController = require("../controllers/BannerController");
const { authenticateAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public Routes
router.get("/", BannerController.getAllBanners);

// Admin-Protected Routes
router.get("/admin", authenticateAdmin, BannerController.getAdminBanners);
router.post("/", authenticateAdmin, upload.single("image"), BannerController.createBanner);
router.put("/:id/status", authenticateAdmin, BannerController.updateBannerStatus);
router.put("/:id", authenticateAdmin, upload.single("image"), BannerController.updateBanner);
router.delete("/:id", authenticateAdmin, BannerController.deleteBanner);

module.exports = router;
