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
}, { _id: false });//why { _id: false }? because if we don't add this then each item in the cart will have its own id and we don't need that

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
    }
);

cartSchema.set("toJSON", { 
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Cart", cartSchema);
