const Order = require("../models/Order");
const Cart = require("../models/Cart");
const CouponService = require("./CouponService");
const { ErrorFactory } = require("../utils/errors");
const PaymentService = require("./payment");
const { sendOrderStatusEmail } = require("../utils/nodemailer");

class OrderService {
    static async createOrder(userId, shippingAddress, paymentMethod, couponCode) {
        // 1. Fetch User's Cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            throw ErrorFactory.badRequest("Your cart is empty");
        }

        // 2. Calculate Subtotal and Format Items
        let subtotal = 0;
        const orderItems = [];

        for (const item of cart.items) {
            if (!item.product) continue;
            
            // Check if product is in stock
            if (item.product.stock < item.quantity) {
                throw ErrorFactory.badRequest(`Product "${item.product.name}" does not have enough stock. Available: ${item.product.stock}`);
            }

            subtotal += item.product.price * item.quantity;
            orderItems.push({
                product: item.product._id.toString(),
                quantity: item.quantity,
                priceAtPurchase: item.product.price.toString()
            });
        }

        if (orderItems.length === 0) {
            throw ErrorFactory.badRequest("Your cart contains invalid items");
        }

        // 3. Apply Coupon if provided
        let discountAmount = 0;
        let appliedCouponId = null;

        if (couponCode) {
            try {
                const coupon = await CouponService.validateCoupon(couponCode, subtotal);
                discountAmount = subtotal * (coupon.discountPercent / 100);
                appliedCouponId = coupon._id;
            } catch (error) {
                throw error;
            }
        }

        const totalAmount = Math.max(0, subtotal - discountAmount);

        // 4. Create Order Document
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            couponApplied: appliedCouponId,
            subtotal,
            discountAmount,
            totalAmount,
            paymentStatus: 'Pending',
            orderStatus: 'Processing'
        });

        // 5. Handle Payment Method
        if (paymentMethod === 'COD') {
            await newOrder.save();
            await OrderService.decrementProductStock(newOrder);
            await newOrder.populate("user", "name email");
            sendOrderStatusEmail(newOrder.user.email, newOrder, "Placed").catch(err => console.error("Email error:", err));
            await Cart.findOneAndUpdate({ user: userId }, { items: [] });
            
            return {
                success: true,
                message: "Order placed successfully (COD)",
                order: newOrder
            };
        } 
        else if (paymentMethod === 'RAZORPAY') {
            const receiptId = `receipt_order_${newOrder._id}`;
            const paymentIntent = await PaymentService.createIntent(totalAmount, "INR", receiptId);
            
            newOrder.razorpayOrderId = paymentIntent.id;
            await newOrder.save();
            await OrderService.decrementProductStock(newOrder);

            return {
                success: true,
                message: "Razorpay order created",
                order: newOrder,
                razorpayOrderId: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency
            };
        } else {
            throw ErrorFactory.badRequest("Invalid payment method");
        }
    }

    static async verifyPayment(userId, razorpay_order_id, razorpay_payment_id, razorpay_signature) {
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, user: userId });
        if (!order) {
            throw ErrorFactory.notFound("Order not found for this payment");
        }

        const isAuthentic = PaymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature); 
        if (isAuthentic) {
            order.paymentStatus = 'Completed';
            order.razorpayPaymentId = razorpay_payment_id;
            order.razorpaySignature = razorpay_signature;
            await order.save();
            await order.populate("user", "name email");
            sendOrderStatusEmail(order.user.email, order, "Placed").catch(err => console.error("Email error:", err));

            await Cart.findOneAndUpdate({ user: userId }, { items: [] });

            return {
                success: true,
                message: "Payment verified successfully",
                order
            };
        } else {
            order.paymentStatus = 'Failed';
            await order.save();
            throw ErrorFactory.badRequest("Invalid payment signature");
        }
    }

    static async handleWebhookPaymentSuccess(razorpayOrderId, razorpayPaymentId) {
        const order = await Order.findOne({ razorpayOrderId: razorpayOrderId });
        if (!order) {
            console.log(`Webhook Error: Order not found for razorpayOrderId: ${razorpayOrderId}`);
            return;
        }

        // If it's already marked completed by the frontend callback, just ignore.
        if (order.paymentStatus === 'Completed') {
            console.log(`Webhook Info: Order ${order._id} is already marked as Completed.`);
            return;
        }

        order.paymentStatus = 'Completed';
        order.razorpayPaymentId = razorpayPaymentId;
        // Webhooks don't have the frontend signature, so we just log 'webhook-verified'
        order.razorpaySignature = 'webhook-verified'; 
        
        await order.save();
        await order.populate("user", "name email");
        sendOrderStatusEmail(order.user.email, order, "Placed").catch(err => console.error("Email error:", err));
        await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

        console.log(`Webhook Success: Order ${order._id} marked as Paid!`);
    }

    static async getUserOrders(userId) {
        return await Order.find({ user: userId }) 
            .populate("items.product", "name images price")
            .sort({ createdAt: -1 });
    }

    static async cancelOrder(userId, orderId) {
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) throw ErrorFactory.notFound("Order not found");
        
        if (!['Processing', 'Pending'].includes(order.orderStatus)) {
            throw ErrorFactory.badRequest(`Cannot cancel order. Status is ${order.orderStatus}`);
        }
        
        order.orderStatus = 'Cancelled';
        await OrderService.incrementProductStock(order);
        
        if (order.paymentStatus === 'Completed') {
            order.paymentStatus = 'Refunded';
            const WalletService = require("./WalletService");
            await WalletService.addFunds(userId, order.totalAmount, "Refund for cancelled order", orderId);
        }
        
        await order.save();
        await order.populate([
            { path: "user", select: "name email" },
            { path: "items.product", select: "name images price" }
        ]);
        sendOrderStatusEmail(order.user.email, order, "Cancelled").catch(err => console.error("Email error:", err));
        return order;
    }

    static async returnOrder(userId, orderId) {
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) throw ErrorFactory.notFound("Order not found");
        
        if (order.orderStatus !== 'Delivered') {
            throw ErrorFactory.badRequest(`Cannot return order. Status is ${order.orderStatus}`);
        }
        
        order.orderStatus = 'Returned';
        await OrderService.incrementProductStock(order);
        
        if (order.paymentStatus === 'Completed') {
            order.paymentStatus = 'Refunded';
            const WalletService = require("./WalletService"); //  circular dependency avoided
            await WalletService.addFunds(userId, order.totalAmount, "Refund for returned order", orderId);
        }
        
        await order.save();
        await order.populate([
            { path: "user", select: "name email" },
            { path: "items.product", select: "name images price" }
        ]);
        sendOrderStatusEmail(order.user.email, order, "Returned").catch(err => console.error("Email error:", err));
        return order;
    }

    static async getAllOrders(query = {}) {
        let filter = {};
        if (query.status) {
            filter.orderStatus = query.status;
        }
        if (query.search) {
            // Find user by name or email, or order by ID
            // Since we need to join user, it's easier to handle user search if we use aggregation or find with populate.
            // But an easy way for Order ID is:
            const mongoose = require('mongoose');
            if (mongoose.Types.ObjectId.isValid(query.search)) {
                filter._id = query.search;
            } else {
                // To search by user we might need to lookup user ids first
                const User = require('../models/User');
                const users = await User.find({
                    $or: [
                        { name: { $regex: query.search, $options: 'i' } },
                        { email: { $regex: query.search, $options: 'i' } }
                    ]
                });
                const userIds = users.map(u => u._id);
                if (userIds.length > 0) {
                    filter.user = { $in: userIds };
                } else {
                    filter.user = { $in: "no data found" };
                }
            }
        }
        return await Order.find(filter)
            .populate("user", "name email")
            .populate("items.product", "name images price")
            .sort({ createdAt: -1 });
    }

    static async updateOrderStatus(orderId, status) {
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
        if (!validStatuses.includes(status)) {
            throw ErrorFactory.badRequest("Invalid order status");
        }
        const order = await Order.findById(orderId);
        if (!order) {
            throw ErrorFactory.notFound("Order not found");
        }
        
        const previousStatus = order.orderStatus;
        order.orderStatus = status;
        
        
        // Handle stock updates on cancel, return or reactivations
        if(['Cancelled','Returned'].includes(previousStatus) &&  status !== previousStatus){
            throw ErrorFactory.badRequest(`Cannot change status. Order is already ${previousStatus.toLowerCase()} and cannot be changed again.`)
        }
        order.orderStatus = status;
        
        // If delivered, we might want to update paymentStatus to Completed if COD
        if (status === 'Delivered' && order.paymentMethod === 'COD' && order.paymentStatus === 'Pending') {
            order.paymentStatus = 'Completed';
        }


        // SIMPLIFIED STOCK UPDATE: Only increment when moving to Cancelled/Returned for the first time
        if ((status === 'Cancelled' || status === 'Returned') && !['Cancelled', 'Returned'].includes(previousStatus)) {
            await OrderService.incrementProductStock(order);
        }

        await order.save();
        await order.populate([
            { path: "user", select: "name email" },
            { path: "items.product", select: "name images price" }
        ]);

        if (status === 'Delivered') {
            sendOrderStatusEmail(order.user.email, order, "Delivered").catch(err => console.error("Email error:", err));
        } else if (status === 'Cancelled') {
            sendOrderStatusEmail(order.user.email, order, "Cancelled").catch(err => console.error("Email error:", err));
        } else if (status === 'Returned') {
            sendOrderStatusEmail(order.user.email, order, "Returned").catch(err => console.error("Email error:", err));
        }

        return order;
    }

    static async getSalesReport(startDate, endDate){
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const matchStage = {
            createdAt: { $gte: start, $lte: end },
            orderStatus: { $nin: ['Cancelled', 'Returned'] }
        };

        const totalStats = await Order.aggregate([
            { $match: matchStage },
            { 
                $group: { 
                    _id: null, 
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                } 
            }
        ]);
        
        const mostSoldProducts = await Order.aggregate([
            { $match: matchStage },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalQuantitySold: { $sum: "$items.quantity" },
                    revenueGenerated: { $sum: { $multiply: ["$items.quantity", "$items.priceAtPurchase"] } }
                }
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 1,
                    totalQuantitySold: 1,
                    revenueGenerated: 1,
                    name: "$product.name",
                    images: "$product.images"
                }
            }
        ]); 

        return {
            totalRevenue: totalStats[0]?.totalRevenue || 0,//[{}]
            totalOrders: totalStats[0]?.totalOrders || 0,
            mostSoldProducts
        };
    }

    static async getOrderStatusForChatbot(orderId) {
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            throw ErrorFactory.badRequest("Invalid Order ID format. Order ID must be a 24-character hexadecimal string.");
        }

        const order = await Order.findById(orderId)
            .populate("items.product", "name price images")
            .populate("user", "name email");

        if (!order) {
            throw ErrorFactory.notFound(`Order with ID ${orderId} was not found.`);
        }

        return order;
    }

    static async decrementProductStock(order) {
        const Product = require("../models/Product");
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
        }
    }

    static async incrementProductStock(order) {
        const Product = require("../models/Product");
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } },
                { new: true }
            );
        }
    }
}

module.exports = OrderService;
