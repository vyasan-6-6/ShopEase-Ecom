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

    static cancelOrder = BaseController.asyncHandler(async (req, res) => {
        const order = await OrderService.cancelOrder(req.user.id, req.params.id);
        BaseController.logAction("ORDER_CANCEL", req.user, { orderId: order._id });
        BaseController.sendSuccess(res, "Order cancelled successfully", { order }, 200);
    });

    static returnOrder = BaseController.asyncHandler(async (req, res) => {
        const order = await OrderService.returnOrder(req.user.id, req.params.id);
        BaseController.logAction("ORDER_RETURN", req.user, { orderId: order._id });
        BaseController.sendSuccess(res, "Order returned successfully", { order }, 200);
    });

    // --- Admin Methods ---

    static getAllOrders = BaseController.asyncHandler(async (req, res) => {
        const query = req.query; // { status, search }
        const orders = await OrderService.getAllOrders(query);
        BaseController.logAction("ADMIN_ORDER_FETCH_ALL", req.admin, { query });
        BaseController.sendSuccess(res, "All orders fetched successfully", { orders }, 200);
    });

    static updateOrderStatus = BaseController.asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            throw ErrorFactory.badRequest("Status is required");
        }
        const order = await OrderService.updateOrderStatus(id, status);
        BaseController.logAction("ADMIN_ORDER_STATUS_UPDATE", req.admin, { orderId: id, status });
        BaseController.sendSuccess(res, "Order status updated successfully", { order }, 200);
    });

    static getSalesReport = BaseController.asyncHandler(async (req, res) => {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            throw ErrorFactory.badRequest("startDate and endDate are required");
        }
        const report = await OrderService.getSalesReport(startDate, endDate);
        BaseController.logAction("ADMIN_SALES_REPORT_GENERATE", req.admin, { startDate, endDate });
        BaseController.sendSuccess(res, "Sales report generated successfully", report, 200);
    });
}

module.exports = OrderController;
