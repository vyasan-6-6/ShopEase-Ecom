require("dotenv").config();//explain well antigravity about this line of code. this line of code is used to load the variables from the .env file to the process.env object. 
const dbConnection = require("../config/db");
const Product = require("../models/Product");
const Category = require("../models/Category");

const seedProducts = async () => {
    try {
        await dbConnection.connect();
        console.log("Database connected. Seeding products...");

        // Fetch categories to attach to products
        const electronicsCat = await Category.findOne({ name: "Electronics" });
        const fashionCat = await Category.findOne({ name: "Fashion" });

        if (!electronicsCat || !fashionCat) {
            console.error("Categories not found! Please run 'node utils/seed_categories.js' first.");
            process.exit(1);
        }

        const products = [
            {
                name: "MacBook Pro M3 Max",
                description: "The most advanced Mac ever built for professionals. Featuring the new M3 Max chip, 36GB Unified Memory, and a stunning Liquid Retina XDR display.",
                price: 3499.00,
                compareAtPrice: 3699.00,
                category: electronicsCat._id,
                stock: 15,
                status: "active",
                images: [
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
                    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
                    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80"
                ]
            },
            {
                name: "Sony WH-1000XM5 Wireless Headphones",
                description: "Industry-leading noise cancellation. Two processors control 8 microphones for unprecedented noise cancellation. With Auto NC Optimizer, noise canceling is automatically optimized based on your wearing conditions.",
                price: 398.00,
                compareAtPrice: 448.00,
                category: electronicsCat._id,
                stock: 45,
                status: "active",
                images: [
                    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
                    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80"
                ]
            },
            {
                name: "Premium Leather Weekend Duffel",
                description: "Handcrafted from full-grain leather, this duffel bag is the perfect companion for weekend getaways. Features a shoe compartment and brass hardware.",
                price: 245.00,
                compareAtPrice: 320.00,
                category: fashionCat._id,
                stock: 8,
                status: "active",
                images: [
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
                    "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=80",
                    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80"
                ]
            },
            {
                name: "Minimalist Automatic Watch",
                description: "A sleek, minimalist timepiece featuring an automatic movement, sapphire crystal, and genuine leather strap. Water-resistant up to 50 meters.",
                price: 199.99,
                compareAtPrice: null,
                category: fashionCat._id,
                stock: 0, // Out of stock example
                status: "active",
                images: [
                    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
                    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80"
                ]
            }
        ];

        // Clear existing products first (optional, but good for a clean seed)
        await Product.deleteMany({});
        console.log("Cleared existing products.");

        for (const prod of products) {
            try {
                await Product.create(prod);
                console.log(`Created product: ${prod.name}`);
            } catch (err) {
                console.error(`Failed to create product ${prod.name}:`, err.message);
            }
        }

        console.log("Product seeding complete!");
    } catch (error) {
        console.error("Error seeding products:", error);
    } finally {
        await dbConnection.disconnect();
    }
};

seedProducts();
