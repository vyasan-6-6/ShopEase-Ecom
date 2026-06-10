const { BannerService } = require("../services");
const BaseController = require("./BaseController");
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
    static createBanner = BaseController.asyncHandler(async (req, res) => {
        const { title, link } = req.body;

        if (!req.file) {
            throw ErrorFactory.badRequest("Please provide a banner image");
        }


        const result = req.file.path;
        if (!result) {
            throw ErrorFactory.internal("Failed to upload image to Cloudinary");
        }

        const bannerData = {
            title,
            link,
            imageUrl: result,
        };

        const banner = await BannerService.createBanner(bannerData);
        BaseController.logAction("BANNER_CREATE", req.admin, { bannerId: banner.id });
        BaseController.sendSuccess(res, "Banner created successfully", { banner }, 201);

    });

    // PUT /api/banners/:id
    static updateBanner = BaseController.asyncHandler(async (req, res) => {
        const { title, link } = req.body;
        const updateData = { title, link };


        if (req.file) {
            // The new image URL is directly available from Multer Cloudinary storage
            updateData.imageUrl = req.file.path;
        }

        const banner = await BannerService.updateBanner(req.params.id, updateData);
        BaseController.logAction("BANNER_UPDATE", req.admin, { bannerId: banner.id });
        BaseController.sendSuccess(res, "Banner updated successfully", { banner });

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
