const ReviewService = require("../services/ReviewService");
const { ErrorFactory } = require("../utils/errors");
const { reviewValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class ReviewController extends BaseController {
    static addReview = BaseController.asyncHandler(async (req, res) => {
       const { rating, comment } = BaseController.validateRequest(reviewValidation, req.body);
        const productId = req.params.productId;
        const userId = req.user.id;

        const review = await ReviewService.addReview(userId, productId, rating, comment);
        BaseController.sendSuccess(res, "Review added successfully", { review }, 201);
    });

    static getProductReviews = BaseController.asyncHandler(async (req, res) => {
        const productId = req.params.productId;
        const reviews = await ReviewService.getProductReviews(productId);
        
        let canReview = false;
        if (req.user) {// check if user can review -- optional auth
            canReview = await ReviewService.canUserReview(req.user.id, productId);
        }

        BaseController.sendSuccess(res, "Reviews fetched", { reviews, canReview });
    });

    static getLatestReviews = BaseController.asyncHandler(async (req, res) => {
        const reviews = await ReviewService.getLatestReviews();
        BaseController.sendSuccess(res, "Latest reviews fetched", { reviews });
    });
    //update, delete user reviews
}

module.exports = ReviewController;
