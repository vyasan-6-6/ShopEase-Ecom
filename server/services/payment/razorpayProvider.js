const Razorpay = require("razorpay");
const crypto = require("crypto");
const { ErrorFactory } = require("../../utils/errors");

class RazorpayProvider {
    static _getInstance() {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw ErrorFactory.internal("Razorpay keys are not configured in environment variables");
        }
        return new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }

    static createPaymentIntent = async (amount, currency = "INR", receiptId) => {
        const razorpay = this._getInstance();
        
        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paisa (smallest unit)
            currency: currency,
            receipt: receiptId
        };

        const razorpayOrder = await razorpay.orders.create(options);
        return {
            id: razorpayOrder.id,
            amount: options.amount,
            currency: options.currency
        };
    };
    
    static verifySignature = (orderId, paymentId, signature) => {
        const body = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === signature; 
        if (!isAuthentic) {
            throw ErrorFactory.badRequest("Invalid payment signature");
        }
        return true;
    };

    static verifyWebhook = (payload, signature) => {
        if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
            throw ErrorFactory.internal("Webhook secret is not configured");
        }
        
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(payload) // payload must be raw bytes here
            .digest("hex");

        if (expectedSignature !== signature) {
            throw ErrorFactory.badRequest("Invalid webhook signature");
        }
        
        // Return parsed JSON event since signature matched
        return JSON.parse(payload.toString());
    };
}

module.exports = RazorpayProvider;
