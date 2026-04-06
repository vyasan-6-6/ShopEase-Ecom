const Admin = require("../models/Admin");
const logger = require("./logger");
const config = require("../config/config");
const mongoose= require("mongoose");
const User = require("../models/User")

const seedAdmin = async () => {
    try {
        // 1. Failsafe checks
        if (!config.DEFAULT_ADMIN.EMAIL || !config.DEFAULT_ADMIN.PASSWORD) {
            logger.warn("Skipping admin seeder: Missing ADMIN credentials in .env");
            return;
        }

        // 2. Idempotency check 
        const existingAdmin = await Admin.findOne({ email: config.DEFAULT_ADMIN.EMAIL });
        if (existingAdmin) {
            logger.info("Default admin already exists. Skipping seeder.");
            return;
        }

        // 3. Create Admin (Mongoose handles the password hashing!)
        const admin = await Admin.create({
            name: config.DEFAULT_ADMIN.NAME || "Super Admin", // Fallback name
            email: config.DEFAULT_ADMIN.EMAIL,
                        password: config.DEFAULT_ADMIN.PASSWORD,
            role: "admin" // Or "admin" depending on your schema
        });
        
        logger.info(`Default admin created successfully: ${admin.email}`);
        
    } catch (error) {
        logger.error(`Error seeding admin: ${error.message}`);
    }
};

const seedTestUsers = async () => {
    const testUsers = [
        {
            name: "John Customer",
            email: "john@example.com",
            password: "passwrd123",
            role: "user",
            status: "active",
            phone: "555-0100",
            isVerified: true
        },{
        name: "Test join",
        email: "join@shopease.com",
        password: "password123", // The Schema's pre('save') hook will hash this!
        role: "user",
        status: "active" ,
        phone: "234-0430",
        isVerified: true
    },
    ];
    // Wipe existing users first to avoid duplicate email array index crashes!
    await User.deleteMany(); 
    logger.warn("Cleared existing normal users from database.");
    // Create the test user
    await User.create(testUsers);
    logger.info("Database seeded with test users successfully!");
};

 //  The Master Runner Function
const runSeeder = async () => {
    try {
        // Connect to Database
        await mongoose.connect(config.MONGODB_URI);
        logger.info(" Connected to MongoDB for seeding...");
        // Run both seeders back-to-back!
        await seedAdmin();
        await seedTestUsers();
        // Safely exit the process
        logger.info("🎉 All seeding completely finished!");
        process.exit(0);
    } catch (error) {
        logger.error(` Error seeding database: ${error.message}`);
        process.exit(1);
    }
};
// Execute the function
runSeeder();
