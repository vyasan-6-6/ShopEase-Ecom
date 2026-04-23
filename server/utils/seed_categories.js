require("dotenv").config();
const dbConnection = require("../config/db");
const Category = require("../models/Category");

const seedCategories = async () => {
    try {
        await dbConnection.connect();
        console.log("Database connected. Seeding categories...");

        const categories = [
            {
                name: "Electronics",
                description: "Latest gadgets, smartphones, and computers.",
                status: "active",
            },  
            {
                name: "Fashion",
                description: "Trendy clothing and accessories for men and women.",
                status: "active",
            },
            {
                name: "Home & Kitchen",
                description: "Essential appliances and decor for your home.",
                status: "active",
            },
            {
                name: "Books",
                description: "A wide collection of fiction and non-fiction books.",
                status: "inactive",
            },
            {
                name: "Beauty & Health",
                description: "Skincare, makeup, and wellness products.",
                status: "active",
            },
        ];

        for (const cat of categories) {
            try {
                // Check by case-insensitive name just in case
                const exists = await Category.findOne({ 
                    name: { $regex: new RegExp("^" + cat.name + "$", "i") } 
                });
                
                if (!exists) {
                    await Category.create(cat);
                    console.log(`Created category: ${cat.name}`);
                } else {
                    console.log(`Category already exists: ${cat.name}`);
                }
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`Category already exists (duplicate slug/name): ${cat.name}`);
                } else {
                    console.error(`Failed to create category ${cat.name}:`, err.message);
                }
            }
        }

        console.log("Seeding complete.");
    } catch (error) {
        console.error("Error seeding categories:", error);
    } finally {
        await dbConnection.disconnect();
    }
};

seedCategories();
