const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticateUser } = require("../middlewares/auth"); 

// Route to create payment intent
router.post("/create-intent", authenticateUser, paymentController.createPaymentIntent);
// Route for payment gateway webhooks
router.post("/webhook", express.raw({ type: 'application/json' }), paymentController.handleWebhook);//after payment razorpay sends a webhook to verify the payment

module.exports = router;
