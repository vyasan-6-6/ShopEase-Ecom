require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");
const ReviewService = require("../services/ReviewService");

const seedReviews = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully!");

        // Clear existing reviews
        console.log("Clearing existing reviews...");
        await Review.deleteMany({});
        // Reset product ratings
        await Product.updateMany({}, { averageRating: 0, reviewCount: 0 });

        // Find delivered orders
        const deliveredOrders = await Order.find({ orderStatus: "Delivered" });

        if (deliveredOrders.length === 0) {
            console.log("No delivered orders found. Please seed orders first.");
            process.exit(1);
        }

        console.log(`Found ${deliveredOrders.length} delivered orders. Generating reviews...`);

        const comments = [
            "Absolutely love this product! Highly recommended.",
            "Great quality for the price. Would buy again.",
            "Fast shipping and the product matches the description perfectly.",
            "Decent product, but could be slightly better.",
            "Exceeded my expectations! Will definitely shop here again.",
            "Works perfectly. Very satisfied with my purchase.",
            "A bit smaller than I expected, but still good.",
            "Fantastic customer service and an amazing product.",
            "Not bad, but I've seen better. It gets the job done.",
            "Incredible value! Five stars all the way."
        ];

        let reviewCount = 0;

        for (const order of deliveredOrders) {
            // Decide randomly if the user leaves a review for this order (e.g., 70% chance)
            if (Math.random() > 0.3) {
                for (const item of order.items) {
                    // Check if already reviewed by this user (since a user might have multiple orders for same product)
                    const existingReview = await Review.findOne({ user: order.user, product: item.product });
                    if (!existingReview) {
                        const randomRating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars mostly
                        const randomComment = comments[Math.floor(Math.random() * comments.length)];
                        
                        const review = new Review({
                            user: order.user,
                            product: item.product,
                            rating: randomRating,
                            comment: randomComment
                        });
                        
                        await review.save();
                        await ReviewService.updateProductRating(item.product);
                        reviewCount++;
                    }
                }
            }
        }

        console.log(`✅ Successfully inserted ${reviewCount} dummy reviews and updated product ratings.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding reviews:", error);
        process.exit(1);
    }
};

seedReviews();
