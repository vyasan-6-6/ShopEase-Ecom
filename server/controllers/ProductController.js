const { ProductService } = require("../services");
const BaseController = require("./BaseController");
const { productValidation } = require("../utils/validation");
const { uploadToCloudinary } = require("../utils/cloudinary");

class ProductController extends BaseController {
    // POST /api/admin/products/upload-images
    static uploadImages = BaseController.asyncHandler(async (req, res) => {
        if (!req.files || req.files.length === 0) {
            return BaseController.sendError(res, "No images provided", 400);
        }

        const uploadedUrls = [];
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.path, "shopease_products");
            if (result && result.secure_url) {
                uploadedUrls.push(result.secure_url);
            }
        }

        if (uploadedUrls.length === 0) {
            return BaseController.sendError(res, "Image upload failed", 500);
        }

        BaseController.sendSuccess(res, "Images uploaded successfully", { urls: uploadedUrls });
    });
    // POST /api/admin/products
    static create = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(productValidation, req.body);
        const product = await ProductService.createProduct(validatedData);
        BaseController.logAction("PRODUCT_CREATE", req.admin, { productId: product.id });
        BaseController.sendSuccess(res, "Product created successfully", { product }, 201);
    });

    // GET /api/products
    static getAll = BaseController.asyncHandler(async (req, res) => {
        const query = {};//create empty filter object for mongodb

        if (!req.admin) {//if req is from normal users , only fetch active products
            query.status = "active";
        }

        // Optional category filtering
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Optional search filtering
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: "i" };
        }

        const page = parseInt(req.query.page) || 1;    //get page number from query parameter or default to 1
        const limit = parseInt(req.query.limit) || 10; //get limit from query parameter or default to 10
        const skip = (page - 1) * limit;           //calculate skip value

        const { products, total } = await ProductService.getProducts(query, skip, limit);
        
        BaseController.sendSuccess(res, "Products fetched successfully", { 
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    });

    // GET /api/admin/products/:id OR /api/user/products/:id
    static getById = BaseController.asyncHandler(async (req, res) => {
        const product = await ProductService.getProductById(req.params.id);
        
        if (!product || (!req.admin && product.status !== "active")) {
            return BaseController.sendError(res, "Product not found", 404);
        }

        BaseController.sendSuccess(res, "Product fetched successfully", { product });
    });

    // GET /api/user/products/slug/:slug
    static getBySlug = BaseController.asyncHandler(async (req, res) => {
        const product = await ProductService.getProductBySlug(req.params.slug);
        
        if (!product || (!req.admin && product.status !== "active")) {
            return BaseController.sendError(res, "Product not found", 404);
        }

        BaseController.sendSuccess(res, "Product fetched successfully", { product });
    });

    // PUT /api/admin/products/:id
    static update = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(productValidation, req.body);
        const product = await ProductService.updateProduct(req.params.id, validatedData);
        BaseController.logAction("PRODUCT_UPDATE", req.admin, { productId: product.id });
        BaseController.sendSuccess(res, "Product updated successfully", { product });
    });

    // DELETE /api/admin/products/:id
    static delete = BaseController.asyncHandler(async (req, res) => {
        const product = await ProductService.deleteProduct(req.params.id);
        BaseController.logAction("PRODUCT_DELETE", req.admin, { productId: req.params.id });
        BaseController.sendSuccess(res, "Product deleted successfully", { product });
    });
}

module.exports = ProductController;
