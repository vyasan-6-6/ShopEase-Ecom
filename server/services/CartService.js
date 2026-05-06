const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { ErrorFactory } = require("../utils/errors");

class CartService {
    /**
     * Get user cart or create one if it doesn't exist
     */
    static async getCart(userId) {
        let cart = await Cart.findOne({ user: userId }).populate({
            path: "items.product", select: "name price images stock category"
        });

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }
 
        return cart;
    }

    /**
     * Add item to cart
     */
    static async addItem(userId, productId, quantity) {
        // Check if product exists first
        const product = await Product.findById(productId);
        if (!product) {
            throw ErrorFactory.notFound("Product not found");
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity }],
            });
        } else {
            // Check if product already exists in cart
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (itemIndex > -1) {  
                // Update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({ product: productId, quantity });
            }
            await cart.save();//why use await here? because save is an async operation and it returns a promise , also it ensures that the cart is saved before returning it
        }

        return this.getCart(userId); // Return populated cart
    }

    /**
     * Update item quantity
     */
    static async updateQuantity(userId, productId, quantity) {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) throw ErrorFactory.notFound("Cart not found");

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
        } else {
            throw ErrorFactory.notFound("Product not found in cart");
        }

        return this.getCart(userId);
    }

    /**
     * Remove item from cart
     */
    static async removeItem(userId, productId) {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) throw ErrorFactory.notFound("Cart not found");

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();
        return this.getCart(userId);
    }

    /**
     * Clear the entire cart
     */
    static async clearCart(userId) {
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        return this.getCart(userId);
    }
}

module.exports = CartService;
