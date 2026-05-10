const OrderService = require("../services/OrderService");
const { ErrorFactory } = require("../utils/errors");
const BaseController = require("./BaseController");

class OrderController extends BaseController {
    static createOrder = BaseController.asyncHandler(async (req, res) => {
        const { shippingAddress, paymentMethod, couponCode } = req.body;
        const userId = req.user.id;

        if (!shippingAddress || !paymentMethod) {
            throw ErrorFactory.badRequest("Shipping address and payment method are required");
        }

        const result = await OrderService.createOrder(userId, shippingAddress, paymentMethod, couponCode);
        BaseController.logAction("ORDER_CREATE", req.user, { orderId: result.order._id });
          BaseController.sendSuccess(res, result.message, result, 201);
    });

    static verifyPayment = BaseController.asyncHandler(async (req, res) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user.id;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            throw ErrorFactory.badRequest("Missing Razorpay payment details");
        }

        const result = await OrderService.verifyPayment(userId, razorpay_order_id, razorpay_payment_id, razorpay_signature);
        BaseController.logAction("ORDER_VERIFY", req.user, { orderId: result.order._id });
        BaseController.sendSuccess(res, result.message, result, 200);
    });

    static getUserOrders = BaseController.asyncHandler(async (req, res) => {
        const orders = await OrderService.getUserOrders(req.user.id);
        BaseController.logAction("ORDER_FETCH", req.user, { orders });
        BaseController.sendSuccess(res, "Orders fetched successfully", { orders }, 200);
    });
}

module.exports = OrderController;
