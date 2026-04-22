const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const { authenticateAdmin } = require("../middlewares/auth");

const router = express.Router();

// All category routes are admin-protected
router.use(authenticateAdmin);

router.post("/", CategoryController.create);
router.get("/", CategoryController.getAll);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete);

module.exports = router;


