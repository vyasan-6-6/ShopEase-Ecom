const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
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

        isDeleted: {
            type: Boolean,
            default: false,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        status: {
            type: String,
            enum: ["active", "banned", "inactive"],
            default: "active",
        },
        resetPassword: {
            otp: String,
            expiresAt: Date,
            attempts: {
                type: Number,
                default: 0,
            },
            lastSendAt: Date,
            isVerified: Boolean,
        },
        otp: {
            code: String,
            expiresAt: Date,
            attempts: {
                type: Number,
                default: 0,
            },
            lastSendAt: Date,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },

        lastLogin: {
            type: Date,
            default: null,
        },

        phone: {
            type: String,
            default: null,
        },

        banReason: {
            type: String,
            default: null,
        },

        bannedAt: {
            type: Date,
            default: null,
        },

        bannedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// userSchema.methods.getPublicProfile = function () {
//     const userObject = this.toObject(); //this.toObject() creates a plain JavaScript copy of the Mongoose document.
//     delete userObject.password; //removes the password only from that copy.
//     return userObject;
// };

userSchema.statics.findActiveUsers = function () {
    return this.find({ status: "active" });
};

userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.trim().toLowerCase()}).select("+password");
};

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;

        ret.id = ret._id; //rename for frondend

        delete ret._id;
        return ret;
    },
});

module.exports = mongoose.model("User", userSchema);
