require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const seedOrders = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully!");

        // Clear existing test orders if needed (optional, keeping it out so we just append)
        // console.log("Clearing existing orders...");
        // await Order.deleteMany({});

        const users = await User.find({ role: "user" }).limit(10);
        const products = await Product.find({}).limit(20);

        if (users.length === 0 || products.length === 0) {
            console.log("Please ensure you have some users and products in the database first.");
            process.exit(1);
        }

        console.log(`Found ${users.length} users and ${products.length} products. Generating orders...`);

        const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
        const paymentStatuses = ['Pending', 'Completed', 'Failed', 'Refunded'];
        const paymentMethods = ['COD', 'RAZORPAY'];

        const dummyOrders = [];

        for (let i = 0; i < 50; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            
            // Pick 1 to 4 random products
            const numItems = Math.floor(Math.random() * 4) + 1;
            const items = [];
            let subtotal = 0;

            for (let j = 0; j < numItems; j++) {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3
                
                items.push({
                    product: randomProduct._id,
                    quantity: quantity,
                    priceAtPurchase: randomProduct.price
                });
                
                subtotal += randomProduct.price * quantity;
            }

            const discountAmount = Math.floor(Math.random() * 5) === 0 ? subtotal * 0.1 : 0; // 20% chance of 10% discount
            const totalAmount = subtotal - discountAmount;

            const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
            let paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
            let paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

            // Logical constraints
            if (paymentMethod === 'COD' && orderStatus !== 'Delivered' && orderStatus !== 'Returned') {
                paymentStatus = 'Pending';
            }
            if (paymentMethod === 'COD' && orderStatus === 'Delivered') {
                paymentStatus = 'Completed';
            }
            if (orderStatus === 'Cancelled' || orderStatus === 'Returned') {
                paymentStatus = (paymentMethod === 'COD') ? 'Pending' : 'Refunded';
            }

            // Random date within the last 45 days
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 45));

            const order = new Order({
                user: randomUser._id,
                items,
                shippingAddress: {
                    street: `${Math.floor(Math.random() * 9999)} Main St`,
                    city: 'Metropolis',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA',
                    phone: '555-0123-456'
                },
                paymentMethod,
                paymentStatus,
                subtotal,
                discountAmount,
                totalAmount,
                orderStatus,
                isDeleted: false,
                deletedAt: null,
                createdAt: pastDate,
                updatedAt: pastDate
            });

            dummyOrders.push(order);
        }

        await Order.insertMany(dummyOrders);
        console.log(`✅ Successfully inserted ${dummyOrders.length} dummy orders.`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding orders:", error);
        process.exit(1);
    }
};

seedOrders();
