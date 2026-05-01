const config = require("../config/config");
const { createAuthLimiter } = require("../middlewares/setup");

const adminRoutes = require("./admin");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const productRoutes = require("./product");
const categoryRoutes = require("./category");
const cartRoutes = require("./cart");

const setupRoutes = (app) => {
    const authLimiter = createAuthLimiter();
    const shouldAuthLimiter = config.NODE_ENV === "production";

    app.use("/api/auth", ...(shouldAuthLimiter ? [authLimiter] : []),   authRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/cart", cartRoutes);
};

module.exports = {
    setupRoutes,
};
