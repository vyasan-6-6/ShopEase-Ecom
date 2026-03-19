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
            index: true, //Add Index for Performance
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            select: false,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        isDelete: {
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
            enum: ["active", "banned","inactive"],
            default: "active",
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

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const hashpassword = await bcrypt.hash(this.password, 12);
        this.password = hashpassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getPublicProfile = function(){
    const userObject = this.toObject();//this.toObject() creates a plain JavaScript copy of the Mongoose document.
    delete userObject.password;//removes the password only from that copy.
    return userObject;
};

userSchema.statics.findActiveUsers = function(){
    return this.find({status:"active"});
};

userSchema.statics.findbyEmail = function(email){
    return this.findOne({email:email.toLowerCase()})
};

module.exports=mongoose.model("User",userSchema);