const Admin = require("../models/Admin");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { ErrorFactory } = require("../utils/errors");
const { generateAdminToken } = require("../utils/jwt");
const logger = require("../utils/logger");

class AdminService {
    static async login(data) {
        const { email, password } = data;
        const admin = await Admin.findByEmail(email);

        if (!admin || admin.role !== "admin") {
            throw ErrorFactory.validation("Invalid admin credentials");
        }

        const isPasswordMatching = await admin.comparePassword(password);
        if (!isPasswordMatching) {
            logger.error("Invalid password");
            throw ErrorFactory.authentication("Invalid email or password");
        }
        if (admin.status === "banned") {
            logger.warn("Banned admin tried to login:", admin.email);
            throw ErrorFactory.authorization("Admin account has been banned");
        }
        const token = generateAdminToken({
            id: admin._id,
            email: admin.email,
            role: admin.role,
        });
        logger.info(`Admin logged in: ${email}`);
        return {
            token,
            admin: admin,
        };
    }

    static async getProfile(adminId) {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            logger.error("Admin not found", adminId);
            throw ErrorFactory.notFound("Admin not found");
        }
        return { admin };
    }

    static async updateProfile(adminId, updateData) {
        const { name } = updateData;
        const admin = await Admin.findByIdAndUpdate(
            adminId,
            { name },
            { returnDocument: 'after', runValidators: true }
        );

        if (!admin) {
            logger.error("Admin not found for update", adminId);
            throw ErrorFactory.notFound("Admin not found");
        }

        logger.info(`Admin profile updated: ${adminId}`);
        return { admin };
    }

    static async getAllUsers(query = {}) {
        let filter = {};
        if (query.search) {
            filter = {
                $or: [
                    { name: { $regex: query.search, $options: 'i' } },
                    { email: { $regex: query.search, $options: 'i' } }
                ]
            };
        }
        
        const users = await User.find(filter)
            .select('-password -resetPassword')
            .sort({ createdAt: -1 });
            
        return { users };
    }

    static async toggleUserBan(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw ErrorFactory.notFound("User not found");
        }

        user.status = user.status === "banned" ? "active" : "banned";
        await user.save();
        
        logger.info(`User ${userId} status changed to ${user.status}`);
        return { user };
    }

    static async getDashboardStats(days) {
        try {
            let dateFilter = {};
            let prevDateFilter = null;
            let calculateChange = false;

            if (days && !isNaN(days)) {
                calculateChange = true;
                const daysInt = parseInt(days);
                
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - daysInt);
                dateFilter = { createdAt: { $gte: startDate } };

                const prevStartDate = new Date(startDate);
                prevStartDate.setDate(prevStartDate.getDate() - daysInt);
                prevDateFilter = { createdAt: { $gte: prevStartDate, $lt: startDate } };
            }

            // Count total items for CURRENT period
            const totalUsers = await User.countDocuments({ status: { $ne: 'banned' }, ...dateFilter });
            const totalProducts = await Product.countDocuments({ isDeleted: false, ...dateFilter });
            const totalOrders = await Order.countDocuments({ ...dateFilter });

            // Aggregate revenue for CURRENT period
            const revenueResult = await Order.aggregate([
                {
                    $match: {
                        paymentStatus: 'Completed',
                        ...dateFilter
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" }
                    }
                }
            ]);
            const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

            // Calculate percentage changes
            let changes = {
                revenueChange: null,
                ordersChange: null,
                usersChange: null,
                productsChange: null
            };

            if (calculateChange) {
                const prevUsers = await User.countDocuments({ status: { $ne: 'banned' }, ...prevDateFilter });
                const prevProducts = await Product.countDocuments({ isDeleted: false, ...prevDateFilter });
                const prevOrders = await Order.countDocuments({ ...prevDateFilter });
                
                const prevRevenueResult = await Order.aggregate([
                    {
                        $match: {
                            paymentStatus: 'Completed',
                            ...prevDateFilter
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: "$totalAmount" }
                        }
                    }
                ]);
                const prevRevenue = prevRevenueResult.length > 0 ? prevRevenueResult[0].totalRevenue : 0;

                const calcPercent = (current, previous) => {
                    if (previous === 0) return current > 0 ? 100 : 0;
                    return ((current - previous) / previous) * 100;
                };

                changes = {
                    revenueChange: calcPercent(totalRevenue, prevRevenue),
                    ordersChange: calcPercent(totalOrders, prevOrders),
                    usersChange: calcPercent(totalUsers, prevUsers),
                    productsChange: calcPercent(totalProducts, prevProducts)
                };
            }
           

            // Get 5 most recent orders for recent activities
            const recentOrders = await Order.find({ ...dateFilter })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'name email')
                .lean();
        
 
            // Format recent orders for the frontend
            const recentActivities = recentOrders.map((order, index) => {
                const userName = order.user ? `${order.user.name || ''}  `.trim() : 'Unknown User';
                
                // Format time difference
                const orderDate = new Date(order.createdAt);
                const diffMs = new Date() - orderDate;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMins / 60);
                const diffDays = Math.floor(diffHours / 24);
                
                let timeStr = 'Just now';
                if (diffDays > 0) timeStr = `${diffDays} days ago`;
                else if (diffHours > 0) timeStr = `${diffHours} hours ago`;
                else if (diffMins > 0) timeStr = `${diffMins} minutes ago`;

                return {
                    id: order._id.toString(),
                    user: userName || order.user?.email || 'User',
                    action: `placed an order`,
                    time: timeStr,
                    amount: `₹${order.totalAmount?.toFixed(2) || '0.00'}`,
                    status: order.paymentStatus === 'Completed' ? 'Success' : (order.paymentStatus || 'Pending')
                };
            });

            const formatChange = (val) => {
                if (val === null) return null;
                const isPositive = val >= 0;
                return {
                    value: `${isPositive ? '+' : ''}${val.toFixed(1)}%`,
                    isPositive
                };
            };

            return {
                stats: {
                    totalRevenue: { value: `₹${totalRevenue.toFixed(2)}`, change: formatChange(changes.revenueChange) },
                    totalOrders: { value: totalOrders.toString(), change: formatChange(changes.ordersChange) },
                    totalUsers: { value: totalUsers.toString(), change: formatChange(changes.usersChange) },
                    totalProducts: { value: totalProducts.toString(), change: formatChange(changes.productsChange) }
                },
                recentActivities
            };
        } catch (error) {
            logger.error("Error fetching dashboard stats:", error);
            throw ErrorFactory.internal("Failed to fetch dashboard statistics");
        }
    }
}

module.exports = AdminService;
