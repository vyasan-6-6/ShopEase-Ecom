const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minlength: [2, "Product name must be at least 2 characters long"],
            maxlength: [100, "Product name cannot exceed 100 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        compareAtPrice: {
            type: Number,
            min: [0, "Compare at price cannot be negative"],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Product category is required"],
        },
        stock: {
            type: Number,
            required: [true, "Product stock is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        images: [
            {
                type: String, // URL of the image
            },
        ],
        status: {
            type: String,
            enum: ["active", "inactive", "draft"],
            default: "active",
        },
        averageRating: {
            type: Number,
            default: 0
        },
        reviewCount: {
            type: Number,
            default: 0
        },
        isDeleted:{
            type:Boolean,
            default:false
        },
        deletedAt:{
            type:Date,
            default:null
        }
    },
    { timestamps: true }
);

// Auto-generate slug before saving if name is modified
productSchema.pre("save", function () {//On the first save, name is considered modified because it’s being set for the first time.
    if (!this.isModified("name")) {
        return;
    }
    this.slug = slugify(this.name, { lower: true, strict: true });
});

productSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

productSchema.pre(/^find/, function () {
    this.where({ isDeleted: { $ne: true } });
});
module.exports = mongoose.model("Product", productSchema);
