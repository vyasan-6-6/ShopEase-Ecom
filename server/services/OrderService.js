const Order = require("../models/Order");
const Cart = require("../models/Cart");
const CouponService = require("./CouponService");
const { ErrorFactory } = require("../utils/errors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

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
            await Cart.findOneAndUpdate({ user: userId }, { items: [] });
            
            return {
                success: true,
                message: "Order placed successfully (COD)",
                order: newOrder
            };
        } 
        else if (paymentMethod === 'RAZORPAY') {
            if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
                throw ErrorFactory.internal("Razorpay keys are not configured");
            }

            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            });

            const options = {
                amount: Math.round(totalAmount * 100), 
                currency: "INR",
                receipt: `receipt_order_${newOrder._id}`
            };

            const razorpayOrder = await razorpay.orders.create(options);
            
            newOrder.razorpayOrderId = razorpayOrder.id;
            await newOrder.save();

            return {
                success: true,
                message: "Razorpay order created",
                order: newOrder,
                razorpayOrderId: razorpayOrder.id,
                amount: options.amount,
                currency: options.currency
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

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature; 
        if (isAuthentic) {
            order.paymentStatus = 'Completed';
            order.razorpayPaymentId = razorpay_payment_id;
            order.razorpaySignature = razorpay_signature;
            await order.save();

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
        
        if (order.paymentStatus === 'Completed') {
            order.paymentStatus = 'Refunded';
            const WalletService = require("./WalletService");
            await WalletService.addFunds(userId, order.totalAmount, "Refund for cancelled order", orderId);
        }
        
        await order.save();
        await order.populate("items.product", "name images price");
        return order;
    }

    static async returnOrder(userId, orderId) {
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) throw ErrorFactory.notFound("Order not found");
        
        if (order.orderStatus !== 'Delivered') {
            throw ErrorFactory.badRequest(`Cannot return order. Status is ${order.orderStatus}`);
        }
        
        order.orderStatus = 'Returned';
        
        if (order.paymentStatus === 'Completed') {
            order.paymentStatus = 'Refunded';
            const WalletService = require("./WalletService"); //  circular dependency avoided
            await WalletService.addFunds(userId, order.totalAmount, "Refund for returned order", orderId);
        }
        
        await order.save();
        await order.populate("items.product", "name images price");
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
                        { firstName: { $regex: query.search, $options: 'i' } },
                        { lastName: { $regex: query.search, $options: 'i' } },
                        { email: { $regex: query.search, $options: 'i' } }
                    ]
                });
                const userIds = users.map(u => u._id);
                if (userIds.length > 0) {
                    filter.user = { $in: userIds };
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
        
        order.orderStatus = status;
        
        // If delivered, we might want to update paymentStatus to Completed if COD
        if (status === 'Delivered' && order.paymentMethod === 'COD' && order.paymentStatus === 'Pending') {
            order.paymentStatus = 'Completed';
        }

        await order.save();
        return await order.populate([
            { path: "user", select: "firstName lastName email" },
            { path: "items.product", select: "name images price" }
        ]);
    }
}

module.exports = OrderService;
