const config = require("../config/config");
const { createAuthLimiter } = require("../middlewares/setup");

const adminRoutes = require("./admin");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const productRoutes = require("./product");
const categoryRoutes = require("./category");
const cartRoutes = require("./cart");
const couponRoutes = require("./coupon");
const orderRoutes = require("./order");
const walletRoutes = require("./wallet");
const chatbotRoutes = require("./chatbot");
const paymentRoutes = require("./payment");

const setupRoutes = (app) => {
    const authLimiter = createAuthLimiter();
    const shouldAuthLimiter = config.NODE_ENV === "production";

    app.use("/api/auth", ...(shouldAuthLimiter ? [authLimiter] : []),   authRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/coupon", couponRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/wallet", walletRoutes);
    app.use("/api/chatbot", chatbotRoutes);
    app.use("/api/payment", paymentRoutes);
};

module.exports = {
    setupRoutes,
};
