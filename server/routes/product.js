const express = require("express");
const ProductController = require("../controllers/ProductController");
const { authenticateAdmin, authenticateAdminOptional, authenticateUser, authenticateAnyUserOptional } = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");
const ReviewController = require("../controllers/ReviewController");
const { productRules, productUpdateRules } = require("../validation/authValidation");
const { validateRequest } = require("../middlewares/validation");

const router = express.Router();

// Public Routes
router.get("/reviews/latest", ReviewController.getLatestReviews);
router.get("/", authenticateAdminOptional, ProductController.getAll);
router.get("/:id", authenticateAdminOptional, ProductController.getById);
router.get("/slug/:slug", authenticateAdminOptional, ProductController.getBySlug);

// Review Routes
router.get("/:productId/reviews", authenticateAnyUserOptional, ReviewController.getProductReviews);
router.post("/:productId/reviews", authenticateUser, ReviewController.addReview);

// Admin-Protected Routes
router.post("/", productRules, validateRequest, authenticateAdmin, ProductController.create);
router.put("/:id", productUpdateRules, validateRequest, authenticateAdmin, ProductController.update);
router.delete("/:id", authenticateAdmin, ProductController.delete);

// Protected upload endpoint (MUST be protected)
router.post("/upload-images", authenticateAdmin, upload.array("images", 5), ProductController.uploadImages);

module.exports = router;
