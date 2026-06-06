require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Password123!', salt);

        const dummyUsers = [];
        const statuses = ['active', 'banned', 'inactive'];

        for (let i = 1; i <= 10; i++) {
            dummyUsers.push({
                name: `Customer ${i}`,
                email: `customer${i}@example.com`,
                password: hashedPassword,
                phone: `987654321${i % 10}`,
                role: 'user',
                status: statuses[Math.floor(Math.random() * statuses.length)],
                isDeleted: false,
            });
        }

        await User.insertMany(dummyUsers);
        console.log('Successfully seeded 10 random users!');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
