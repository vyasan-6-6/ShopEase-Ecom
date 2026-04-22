const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            minlength: [2, "Category name must be at least 2 characters long"],
            maxlength: [50, "Category name cannot exceed 50 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Auto-generate slug before saving if it doesn't exist or name is modified
categorySchema.pre("save", function (next) {
    if (!this.isModified("name")) {
        return next();
    }
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

categorySchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Category", categorySchema);