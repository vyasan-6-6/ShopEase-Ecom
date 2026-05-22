const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { ErrorFactory } = require("../utils/errors");

class ReviewService {
    static async addReview(userId, productId, rating, comment) {
        // 1. Check if user bought the product and it's delivered
        const hasPurchased = await Order.findOne({
            user: userId,
            "items.product": productId,
            orderStatus: "Delivered"
        });

        if (!hasPurchased) {
            throw ErrorFactory.forbidden("You can only review products you have purchased and received.");
        }

        // 2. Check if already reviewed
        const existingReview = await Review.findOne({ user: userId, product: productId });
        if (existingReview) {
            throw ErrorFactory.badRequest("You have already reviewed this product.");
        }

        // 3. Create review
        const review = new Review({
            user: userId,
            product: productId,
            rating,
            comment
        });

        await review.save();

        // 4. Update product rating stats
        await this.updateProductRating(productId);

        return await review.populate("user", "name avatar");
    }

    static async updateProductRating(productId) {
        const stats = await Review.aggregate([
            { $match: { product: new (require('mongoose').Types.ObjectId)(productId) } },
            { 
                $group: {
                    _id: "$product",
                    avgRating: { $avg: "$rating" },
                    numReviews: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: Math.round(stats[0].avgRating * 10) / 10,
                reviewCount: stats[0].numReviews
            });
        } else {
            await Product.findByIdAndUpdate(productId, {
                averageRating: 0,
                reviewCount: 0
            });
        }
    }

    static async getProductReviews(productId) {
        return await Review.find({ product: productId })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });
    }

    static async getLatestReviews() {
        // Fetch 3 most recent 5-star reviews for the homepage
        return await Review.find({ rating: 5 })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 })
            .limit(3);
    }

    static async canUserReview(userId, productId) {
        if (!userId) return false;
        
        const existingReview = await Review.findOne({ user: userId, product: productId });
        if (existingReview) return false;

        const hasPurchased = await Order.findOne({
            user: userId,
            "items.product": productId,
            orderStatus: "Delivered"
        });

        return !!hasPurchased;
    }
}

module.exports = ReviewService;
