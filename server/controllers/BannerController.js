const { BannerService } = require("../services");
const BaseController = require("./BaseController");
const { uploadToCloudinary } = require("../utils/cloudinary");
const fs = require("fs");
const { ErrorFactory } = require("../utils/errors");

class BannerController extends BaseController {
    // GET /api/banners
    static getAllBanners = BaseController.asyncHandler(async (req, res) => {
        const banners = await BannerService.getActiveBanners();
        BaseController.sendSuccess(res, "Banners fetched successfully", { banners });
    });

    // GET /api/banners/admin
    static getAdminBanners = BaseController.asyncHandler(async (req, res) => {
        const banners = await BannerService.getAllBanners();
        BaseController.logAction("BANNER_FETCH", req.admin, { count: banners.length });
        BaseController.sendSuccess(res, "Admin banners fetched successfully", { banners });
    });

    // POST /api/banners
    static createBanner = BaseController.asyncHandler(async (req, res, next) => {
        const { title, link } = req.body;

        if (!req.file) {
            ErrorFactory.badRequest("Please provide a banner image");
        }

        try {
            // Upload to Cloudinary
            const result = await uploadToCloudinary(req.file.path, "shopease_banners");
            
            if (!result) {
                ErrorFactory.internal("Failed to upload image to Cloudinary");
            }

            const bannerData = {
                title,
                link,
                imageUrl: result.secure_url,
            };

            const banner = await BannerService.createBanner(bannerData);
            BaseController.logAction("BANNER_CREATE", req.admin, { bannerId: banner.id });
            BaseController.sendSuccess(res, "Banner created successfully", { banner }, 201);
        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            next(error);
        }
    });

    // PUT /api/banners/:id
    static updateBanner = BaseController.asyncHandler(async (req, res, next) => {
        const { title, link } = req.body;
        const updateData = { title, link };

        try {
            if (req.file) {
                // Upload new image to Cloudinary
                const result = await uploadToCloudinary(req.file.path, "shopease_banners");
                if (!result) {
                    ErrorFactory.internal("Failed to upload image to Cloudinary");
                }
                updateData.imageUrl = result.secure_url;
            }

            const banner = await BannerService.updateBanner(req.params.id, updateData);
            BaseController.logAction("BANNER_UPDATE", req.admin, { bannerId: banner.id });
            BaseController.sendSuccess(res, "Banner updated successfully", { banner });
        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            next(error);
        }
    });

    // PUT /api/banners/:id/status
    static updateBannerStatus = BaseController.asyncHandler(async (req, res) => {
        const { isActive } = req.body;
        const banner = await BannerService.updateBannerStatus(req.params.id, isActive);
        BaseController.logAction("BANNER_STATUS_UPDATE", req.admin, { bannerId: banner.id, isActive });
        BaseController.sendSuccess(res, "Banner status updated successfully", { banner });
    });

    // DELETE /api/banners/:id
    static deleteBanner = BaseController.asyncHandler(async (req, res) => {
        const banner = await BannerService.deleteBanner(req.params.id);
        BaseController.logAction("BANNER_DELETE", req.admin, { bannerId: req.params.id });
        BaseController.sendSuccess(res, "Banner deleted successfully", null);
    });
}

module.exports = BannerController;
