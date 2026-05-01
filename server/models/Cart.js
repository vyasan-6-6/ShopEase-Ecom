const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({//for populating the cart items with product data
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1"],
        default: 1,
    },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,//id of user from User model which refetes to the owner of the cart
            ref: "User",
            required: true,
            unique: true, // One cart per user
        },
        items: [cartItemSchema],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for total price calculation could be added here if needed
// but usually it's better to calculate it in the service or on the fly
// since product prices can change.

module.exports = mongoose.model("Cart", cartSchema);
