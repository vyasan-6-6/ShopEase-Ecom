const express = require('express');
const AdminController = require('../controllers/AdminController');
const { authenticateAdmin } = require('../middlewares/auth');

const router = express.Router();

router.post("/login", AdminController.login);
router.get("/getProfile", authenticateAdmin, AdminController.getProfile);
router.put("/updateProfile", authenticateAdmin, AdminController.updateProfile);

// router.use("/categories", categoryRoutes);
// router.use("/products", productRoutes);

// Order Management
const OrderController = require('../controllers/OrderController');
router.get("/orders", authenticateAdmin, OrderController.getAllOrders);
router.put("/order/:id/status", authenticateAdmin, OrderController.updateOrderStatus);

// router.get("/users/:id");
// router.put("/users/:id");
// router.post("/users/:id/ban");
// router.post("/users/:id/unban");
// router.post("/users/:id/force-logout");
// router.patch("/users/:id/status");
// router.get("/stats");

module.exports = router;