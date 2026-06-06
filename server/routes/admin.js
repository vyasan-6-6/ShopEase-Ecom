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
router.get("/reports/sales", authenticateAdmin, OrderController.getSalesReport);
router.get("/stats", authenticateAdmin, AdminController.getDashboardStats);



module.exports = router;