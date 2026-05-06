const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const { authenticateAdmin } = require("../middlewares/auth");

const router = express.Router();

// Public Routes
router.get("/", CategoryController.getAll);

// Admin-Protected Routes
router.post("/", authenticateAdmin, CategoryController.create);
router.put("/:id", authenticateAdmin, CategoryController.update);
router.delete("/:id", authenticateAdmin, CategoryController.delete);

module.exports = router;


