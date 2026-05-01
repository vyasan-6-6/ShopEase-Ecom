const BaseController = require("./BaseController");
const CartService = require("../services/CartService");
const { ErrorFactory } = require("../utils/errors");
const { addToCartValidation, updateQuantityValidation } = require("../utils/validation");

class CartController extends BaseController {
    /**
     * Get user cart
     */
    static getCart = BaseController.asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const cart = await CartService.getCart(userId);
        return BaseController.sendSuccess(res, "Cart retrieved successfully", cart);
    });

    /**
     * Add item to cart
     */
    static addToCart = BaseController.asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const validatedData = BaseController.validateRequest(addToCartValidation, req.body);

        const cart = await CartService.addItem(
            userId, 
            validatedData.productId, 
            validatedData.quantity || 1
        );
        return BaseController.sendSuccess(res, "Item added to cart", cart);
    });

    /**
     * Update item quantity
     */
    static updateQuantity = BaseController.asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const validatedData = BaseController.validateRequest(updateQuantityValidation, req.body);

        const cart = await CartService.updateQuantity(
            userId, 
            validatedData.productId, 
            validatedData.quantity
        );
        return BaseController.sendSuccess(res, "Cart updated successfully", cart);
    });

    /**
     * Remove item from cart
     */
    static removeFromCart = BaseController.asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const { productId } = req.params;

        if (!productId) {
            throw ErrorFactory.validation("Product ID is required");
        }

        const cart = await CartService.removeItem(userId, productId);
        return BaseController.sendSuccess(res, "Item removed from cart", cart);
    });

    /**
     * Clear cart
     */
    static clearCart = BaseController.asyncHandler(async (req, res) => {
        const userId = req.user.id;
        await CartService.clearCart(userId);
        return BaseController.sendSuccess(res, "Cart cleared successfully", { items: [] });
    });
}

module.exports = CartController;