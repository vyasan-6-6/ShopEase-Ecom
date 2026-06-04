const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authenticateAnyUser, authenticateAnyUserOptional } = require('../middlewares/auth');

// Get order status by ID (for Chatbot - supports optional authentication)
router.get('/status/:id', authenticateAnyUserOptional, OrderController.getOrderStatusForChatbot);

// All other order routes require authentication
router.use(authenticateAnyUser);

// Create an order (COD or Razorpay initialization)
router.post('/create', OrderController.createOrder);

// Verify Razorpay payment
router.post('/verify-payment', OrderController.verifyPayment);

// Get logged in user's orders
router.get('/my-orders', OrderController.getUserOrders);

// Cancel an order
router.post('/:id/cancel', OrderController.cancelOrder);

// Return an order
router.post('/:id/return', OrderController.returnOrder);

module.exports = router;
