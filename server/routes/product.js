const express = require("express");
const ProductController = require("../controllers/ProductController");
const { authenticateAdmin, authenticateAdminOptional } = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public Routes
router.get("/", authenticateAdminOptional, ProductController.getAll);
router.get("/:id", authenticateAdminOptional, ProductController.getById);
router.get("/slug/:slug", authenticateAdminOptional, ProductController.getBySlug);

// Admin-Protected Routes
router.post("/", authenticateAdmin, ProductController.create);
router.put("/:id", authenticateAdmin, ProductController.update);
router.delete("/:id", authenticateAdmin, ProductController.delete);

// Protected upload endpoint (MUST be protected)
router.post("/upload-images", authenticateAdmin, upload.array("images", 5), ProductController.uploadImages);

module.exports = router;
