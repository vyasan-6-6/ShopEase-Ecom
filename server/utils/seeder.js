const Admin = require("../models/Admin");
const logger = require("./logger");

const seedAdmin = async () => {
    try {
        // 1. Failsafe checks
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            logger.warn("Skipping admin seeder: Missing ADMIN credentials in .env");
            return;
        }

        // 2. Idempotency check 
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            logger.info("Default admin already exists. Skipping seeder.");
            return;
        }

        // 3. Create Admin (Mongoose handles the password hashing!)
        const admin = await Admin.create({
            name: process.env.ADMIN_NAME || "Super Admin", // Fallback name
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: "admin" // Or "admin" depending on your schema
        });
        
        logger.info(`Default admin created successfully: ${admin.email}`);
        
    } catch (error) {
        logger.error(`Error seeding admin: ${error.message}`);
    }
};

module.exports = { seedAdmin };
