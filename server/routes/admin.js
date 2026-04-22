const express = require('express');
const AdminController = require('../controllers/AdminController');
const { authenticateAdmin } = require('../middlewares/auth');
const categoryRoutes = require('./category');

const router = express.Router();

router.post("/login",AdminController.login);
router.get("/getProfile", authenticateAdmin, AdminController.getProfile);
router.put("/updateProfile", authenticateAdmin, AdminController.updateProfile);

// Category CRUD — /api/admin/categories
router.use("/categories", categoryRoutes);//used to mount the category routes

// router.get("/users/:id");
// router.put("/users/:id");
// router.post("/users/:id/ban");
// router.post("/users/:id/unban");
// router.post("/users/:id/force-logout");
// router.patch("/users/:id/status");
// router.get("/stats");

module.exports = router;