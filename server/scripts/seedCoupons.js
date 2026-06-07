require("dotenv").config(); 
const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopease";

const coupons = [
    { code: "WELCOME10", discountPercent: 10, expiryDate: "2026-12-31T23:59:59Z", minOrderAmount: 0, isActive: true },
    { code: "WELCOME20", discountPercent: 20, expiryDate: "2026-12-31T23:59:59Z", minOrderAmount: 50, isActive: true },
    { code: "SUMMER25", discountPercent: 25, expiryDate: "2026-08-31T23:59:59Z", minOrderAmount: 100, isActive: true },
    { code: "WINTER30", discountPercent: 30, expiryDate: "2026-02-28T23:59:59Z", minOrderAmount: 150, isActive: true },
    { code: "BLACKFRIDAY", discountPercent: 50, expiryDate: "2026-11-30T23:59:59Z", minOrderAmount: 200, isActive: true },
    { code: "CYBERMONDAY", discountPercent: 40, expiryDate: "2026-12-02T23:59:59Z", minOrderAmount: 100, isActive: true },
    { code: "NEWYEAR24", discountPercent: 24, expiryDate: "2026-01-31T23:59:59Z", minOrderAmount: 80, isActive: true },
    { code: "SPRINGSALE", discountPercent: 15, expiryDate: "2026-05-31T23:59:59Z", minOrderAmount: 60, isActive: true },
    { code: "VIP50", discountPercent: 50, expiryDate: "2027-12-31T23:59:59Z", minOrderAmount: 500, isActive: true },
    { code: "FLASH15", discountPercent: 15, expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), minOrderAmount: 0, isActive: true },
    { code: "HALFOFF", discountPercent: 50, expiryDate: "2026-12-31T23:59:59Z", minOrderAmount: 1000, isActive: true },
    { code: "MINUS5", discountPercent: 5, expiryDate: "2027-01-01T23:59:59Z", minOrderAmount: 10, isActive: true },
    { code: "SAVEBIG", discountPercent: 35, expiryDate: "2026-10-31T23:59:59Z", minOrderAmount: 250, isActive: true },
    { code: "FREESHIP20", discountPercent: 20, expiryDate: "2026-09-30T23:59:59Z", minOrderAmount: 120, isActive: true },
    { code: "BINGO10", discountPercent: 10, expiryDate: "2026-11-15T23:59:59Z", minOrderAmount: 30, isActive: true },
    { code: "LUCKY7", discountPercent: 7, expiryDate: "2026-07-07T23:59:59Z", minOrderAmount: 77, isActive: true },
    { code: "SWEET16", discountPercent: 16, expiryDate: "2026-12-31T23:59:59Z", minOrderAmount: 160, isActive: true },
    // Expired or Inactive Coupons for testing
    { code: "EXPIRED10", discountPercent: 10, expiryDate: "2022-01-01T00:00:00Z", minOrderAmount: 0, isActive: true },
    { code: "OLDPROMO", discountPercent: 20, expiryDate: "2023-05-15T00:00:00Z", minOrderAmount: 50, isActive: true },
    { code: "INACTIVE50", discountPercent: 50, expiryDate: "2026-12-31T23:59:59Z", minOrderAmount: 0, isActive: false },
];

async function seedCoupons() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Optional: clear existing coupons if we want a clean slate
        // await Coupon.deleteMany({});
        // console.log("Cleared existing coupons.");

        for (const couponData of coupons) {
            try {
                const existing = await Coupon.findOne({ code: couponData.code });
                if (!existing) {
                    await Coupon.create(couponData);
                    console.log(`Created coupon: ${couponData.code}`);
                } else {
                    console.log(`Coupon already exists: ${couponData.code}`);
                }
            } catch (err) {
                console.error(`Error creating ${couponData.code}:`, err.message);
            }
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}

seedCoupons();
