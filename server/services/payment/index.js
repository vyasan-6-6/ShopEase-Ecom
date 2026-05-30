const activeProvider = require("./razorpayProvider");

class PaymentService {
    static createIntent = async (amount, currency = 'INR', receiptId) => {
        return await activeProvider.createPaymentIntent(amount, currency, receiptId);
    }
 
    static verifySignature = (orderId, paymentId, signature) => {
        return activeProvider.verifySignature(orderId, paymentId, signature);
    }

    static verifyWebhook = (payload, signature) => {
        return activeProvider.verifyWebhook(payload, signature);
    }

    static handleEvent = async (event) => {
        // Razorpay sends events like 'payment.captured', 'order.paid'
        switch (event.event) {
            case 'payment.captured':
            case 'order.paid':
                const entity = event.payload.payment.entity;
                console.log(`Webhook: Payment for ${entity.amount} was successful!`);
                const OrderService = require('../OrderService');
                await OrderService.handleWebhookPaymentSuccess(entity.order_id, entity.id);
                break;
            default:
                console.log(`Unhandled webhook event: ${event.event}`);
        }
    }
}

module.exports = PaymentService;
