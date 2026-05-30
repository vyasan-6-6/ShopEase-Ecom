const PaymentService = require("../services/payment");
const BaseController = require("./BaseController");

class PaymentController extends BaseController {
    
    static createPaymentIntent = BaseController.asyncHandler(async (req, res) => {
        const { amount, currency } = req.body;
        const userId = req.user.id;

        const paymentIntent = await PaymentService.createIntent(amount, currency, userId);
        
        BaseController.sendSuccess(res, "Payment intent created successfully", { clientSecret: paymentIntent.clientSecret });
    });

    static handleWebhook = BaseController.asyncHandler(async (req, res) => {
        const signature = req.headers['x-razorpay-signature']; 
        const payload = req.body;

        const event = await PaymentService.verifyWebhook(payload, signature);
        
        // Handle the event
        await PaymentService.handleEvent(event);

        // Sending raw success to Razorpay without normal response format, it is for razorpay robot , it si looing for only on ething status code of 200 ok
        res.status(200).json({ received: true });
    });
}

module.exports = PaymentController;
