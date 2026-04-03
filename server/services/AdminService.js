const Admin = require("../models/Admin");
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
}

module.exports = AdminService;
