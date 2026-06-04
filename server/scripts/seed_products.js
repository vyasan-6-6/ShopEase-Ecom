require("dotenv").config();
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
        const homeCat = await Category.findOne({ name: "Home & Kitchen" });
        const booksCat = await Category.findOne({ name: "Books" });
        const beautyCat = await Category.findOne({ name: "Beauty & Health" });

        if (!electronicsCat || !fashionCat || !homeCat || !booksCat || !beautyCat) {
            console.error("Categories not found! Please run 'node utils/seed_categories.js' first.");
            process.exit(1);
        }

        const products = [
            // ELECTRONICS
            {
                name: "MacBook Pro M3 Max",
                description: "The most advanced Mac ever built for professionals. Featuring the new M3 Max chip, 36GB Unified Memory, and a stunning Liquid Retina XDR display.",
                price: 3499.00,
                compareAtPrice: 3699.00,
                category: electronicsCat._id,
                stock: 15,
                status: "active",
                images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"]
            },
            {
                name: "Sony WH-1000XM5 Wireless Headphones",
                description: "Industry-leading noise cancellation. Two processors control 8 microphones for unprecedented noise cancellation.",
                price: 398.00,
                compareAtPrice: 448.00,
                category: electronicsCat._id,
                stock: 45,
                status: "active",
                images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80"]
            },
            {
                name: "Ultra-Slim 4K Monitor",
                description: "27-inch 4K UHD monitor with HDR10 support, 99% sRGB color gamut, and ultra-thin bezels for a seamless dual-monitor setup.",
                price: 450.00,
                compareAtPrice: 500.00,
                category: electronicsCat._id,
                stock: 20,
                status: "active",
                images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"]
            },
            {
                name: "Wireless Mechanical Keyboard",
                description: "Compact 75% layout with hot-swappable switches, RGB backlighting, and Bluetooth/2.4GHz/Wired connectivity.",
                price: 120.00,
                compareAtPrice: null,
                category: electronicsCat._id,
                stock: 35,
                status: "active",
                images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80"]
            },

            // FASHION
            {
                name: "Premium Leather Weekend Duffel",
                description: "Handcrafted from full-grain leather, this duffel bag is the perfect companion for weekend getaways.",
                price: 245.00,
                compareAtPrice: 320.00,
                category: fashionCat._id,
                stock: 8,
                status: "active",
                images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"]
            },
            {
                name: "Minimalist Automatic Watch",
                description: "A sleek, minimalist timepiece featuring an automatic movement, sapphire crystal, and genuine leather strap.",
                price: 199.99,
                compareAtPrice: null,
                category: fashionCat._id,
                stock: 0,
                status: "active",
                images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80"]
            },
            {
                name: "Classic Denim Jacket",
                description: "Timeless vintage-wash denim jacket with copper hardware. Perfect for layering in any season.",
                price: 85.00,
                compareAtPrice: 110.00,
                category: fashionCat._id,
                stock: 50,
                status: "active",
                images: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0efa?w=800&q=80"]
            },

            // HOME & KITCHEN
            {
                name: "Ceramic Non-Stick Cookware Set",
                description: "12-piece premium ceramic non-stick cookware set. Eco-friendly, toxin-free, and induction compatible.",
                price: 149.00,
                compareAtPrice: 199.00,
                category: homeCat._id,
                stock: 25,
                status: "active",
                images: ["https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=800&q=80"]
            },
            {
                name: "Smart Coffee Maker",
                description: "Wi-Fi enabled drip coffee maker. Schedule your morning brew from your smartphone.",
                price: 89.99,
                compareAtPrice: 120.00,
                category: homeCat._id,
                stock: 12,
                status: "active",
                images: ["https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80"]
            },
            {
                name: "Minimalist Table Lamp",
                description: "Warm LED table lamp with a brass finish and frosted glass globe. Adds a touch of mid-century modern style.",
                price: 45.00,
                compareAtPrice: null,
                category: homeCat._id,
                stock: 40,
                status: "active",
                images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"]
            },

            // BOOKS
            {
                name: "The Art of Clean Code",
                description: "A comprehensive guide to writing readable, maintainable, and efficient code in any programming language.",
                price: 39.99,
                compareAtPrice: 49.99,
                category: booksCat._id,
                stock: 100,
                status: "active", // Note: The category itself is inactive, let's see how the frontend handles this!
                images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80"]
            },
            {
                name: "World Atlas 2026 Edition",
                description: "Fully updated geographical atlas featuring high-resolution satellite imagery and topographic maps.",
                price: 25.50,
                compareAtPrice: 35.00,
                category: booksCat._id,
                stock: 60,
                status: "active",
                images: ["https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80"]
            },

            // BEAUTY & HEALTH
            {
                name: "Vitamin C Brightening Serum",
                description: "Dermatologist-tested 15% Vitamin C serum with hyaluronic acid. Visibly brightens and evens skin tone.",
                price: 34.00,
                compareAtPrice: null,
                category: beautyCat._id,
                stock: 85,
                status: "active",
                images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"]
            },
            {
                name: "Aromatherapy Essential Oil Diffuser",
                description: "Ultrasonic cool mist humidifier and diffuser with 7 LED light colors and auto shut-off.",
                price: 28.99,
                compareAtPrice: 39.99,
                category: beautyCat._id,
                stock: 30,
                status: "active",
                images: ["https://images.unsplash.com/photo-1608528577891-88546b43ca0d?w=800&q=80"]
            },
            {
                name: "Organic Matcha Green Tea Powder",
                description: "Ceremonial grade matcha powder imported directly from Uji, Japan. Rich in antioxidants.",
                price: 22.50,
                compareAtPrice: 28.00,
                category: beautyCat._id,
                stock: 150,
                status: "active",
                images: ["https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=800&q=80"]
            },
            
            // MORE MIXED PRODUCTS FOR PAGINATION
            {
                name: "Ergonomic Office Chair",
                description: "Mesh back ergonomic chair with adjustable lumbar support, 3D armrests, and a dynamic tilt mechanism.",
                price: 299.00,
                compareAtPrice: 399.00,
                category: homeCat._id,
                stock: 18,
                status: "active",
                images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80"]
            },
            {
                name: "Noise-Isolating Earbuds",
                description: "True wireless earbuds with active noise cancellation, transparency mode, and rich, immersive sound.",
                price: 129.00,
                compareAtPrice: 149.00,
                category: electronicsCat._id,
                stock: 80,
                status: "active",
                images: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80"]
            },
            {
                name: "Canvas High-Top Sneakers",
                description: "Everyday canvas sneakers with a durable rubber sole and cushioned insole for all-day comfort.",
                price: 55.00,
                compareAtPrice: 70.00,
                category: fashionCat._id,
                stock: 100,
                status: "active",
                images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80"]
            },
            {
                name: "Portable Power Bank 20000mAh",
                description: "High-capacity portable charger with fast charging support, dual USB ports, and LED display.",
                price: 45.00,
                compareAtPrice: 60.00,
                category: electronicsCat._id,
                stock: 200,
                status: "active",
                images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80"]
            },
            {
                name: "Cotton Crewneck T-Shirt 3-Pack",
                description: "Essential soft cotton t-shirts in classic black, white, and grey. A staple for any wardrobe.",
                price: 35.00,
                compareAtPrice: null,
                category: fashionCat._id,
                stock: 150,
                status: "active",
                images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"]
            }
        ];

        // Clear existing products first (optional, but good for a clean seed)
        await Product.deleteMany({});
        console.log("Cleared existing products.");

        const productsWithDefaults = products.map(p => ({ ...p, isDeleted: false, deletedAt: null }));

        for (const prod of productsWithDefaults) {
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
