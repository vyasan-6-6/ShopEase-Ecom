const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Banner title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        imageUrl: {
            type: String,
            required: [true, "Banner image URL is required"],
        },
        link: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

bannerSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

bannerSchema.pre(/^find/, function () {
    this.where({ isDeleted: { $ne: true } });
});

module.exports = mongoose.model("Banner", bannerSchema);
