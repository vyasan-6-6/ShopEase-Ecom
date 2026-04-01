const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
      name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            select: false,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
        },
        // Useful if you have a top-level owner vs regular staff admins
        role: {
            type: String,
            enum: ["admin", "superadmin"], 
            default: "admin",
        },
        // Granular control over what pages/actions the admin can perform
        permissions: [{
            type: String,
            enum: ["manage_users", "manage_products", "manage_orders", "view_analytics", "manage_settings"],
        }],
        status: {
            type: String,
            enum: ["active", "suspended"],
            default: "active",
        },
        // MFA / 2FA could be added here for extra admin security
        isTwoFactorEnabled: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true },
);

// Hash the password before saving
adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});
// Compare password securely
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
// Static helper to find by email
adminSchema.statics.findByEmail = function (email) {
    if(!email) return null;
    return this.findOne({ email: email.trim().toLowerCase() }).select("+password");
};
// Clean up response objects globally
adminSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id; // rename for frontend consistency
        delete ret._id;   // delete original _id
        
        return ret;
    },
});
module.exports = mongoose.model("Admin", adminSchema);