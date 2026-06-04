const mongoose = require("mongoose");
const Banner = require("../models/Banner");
const logger = require("../utils/logger");
const config = require("../config/config");

const seedBanners = async () => {
    const banners = [
        {
            title: "Active: Summer Sale 2026",
            imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop",
            link: "/category/summer",
            isActive: true,
            isDeleted: false,
            deletedAt: null
        },
        {
            title: "Active: New Electronics",
            imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop",
            link: "/category/electronics",
            isActive: true,
            isDeleted: false,
            deletedAt: null
        },
        {
            title: "Inactive: Winter Clearance",
            imageUrl: "https://images.unsplash.com/photo-1548624141-f673e4b47245?q=80&w=1200&auto=format&fit=crop",
            link: "/category/winter",
            isActive: false, // Inactive scenario
            isDeleted: false,
            deletedAt: null
        },
        {
            title: "Deleted: Old Promotional Banner",
            imageUrl: "https://images.unsplash.com/photo-1558769132-cb1fac08b4af?q=80&w=1200&auto=format&fit=crop",
            link: "/category/old",
            isActive: false,
            isDeleted: true, // Soft-deleted scenario
            deletedAt: new Date()
        }
    ];

    try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info("Connected to MongoDB for seeding banners...");

        await Banner.deleteMany();
        logger.warn("Cleared existing banners from database.");

        await Banner.create(banners);
        logger.info("Database seeded with different banner scenarios successfully!");

        process.exit(0);
    } catch (error) {
        logger.error(`Error seeding banners: ${error.message}`);
        process.exit(1);
    }
};

seedBanners();
