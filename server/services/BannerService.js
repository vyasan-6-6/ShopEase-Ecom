const Banner = require("../models/Banner");
const { ErrorFactory } = require("../utils/errors");

class BannerService {
    static async getActiveBanners() {
        return await Banner.find({ isActive: true }).sort("-createdAt");
    }

    static async getAllBanners() {
        return await Banner.find().sort("-createdAt");
    }

    static async createBanner(data) {
        const banner = new Banner(data);
        return await banner.save();
    }

    static async updateBanner(id, updateData) {
        const banner = await Banner.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!banner) {
            ErrorFactory.notFound("Banner not found");
        }
        return banner;
    }

    static async updateBannerStatus(id, isActive) {
        const banner = await Banner.findByIdAndUpdate(
            id,
            { isActive },
            { new: true, runValidators: true }
        );
        if (!banner) {
            ErrorFactory.notFound("Banner not found");
        }
        return banner;
    }

    static async deleteBanner(id) {
        return await Banner.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true, runValidators: true });
    }
}

module.exports = BannerService;
