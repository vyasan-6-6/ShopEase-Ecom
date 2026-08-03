const { ProductService } = require("../services");
const BaseController = require("./BaseController");
const { productValidation } = require("../utils/validation");
const { getCache, setCache, deleteCache, flushCachePattern } = require("../config/redis");

class ProductController extends BaseController {
    // POST /api/admin/products/upload-images
    static uploadImages = BaseController.asyncHandler(async (req, res) => {
        if (!req.files || req.files.length === 0) {
            return BaseController.sendError(res, "No images provided", 400);
        }

        const uploadedUrls = req.files.map(file=>file.path);
        
        if (uploadedUrls.length === 0) {
            return BaseController.sendError(res, "Image upload failed", 500);
        }

        BaseController.sendSuccess(res, "Images uploaded successfully", { urls: uploadedUrls });
    });
    // POST /api/admin/products
    static create = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(productValidation, req.body);
        const product = await ProductService.createProduct(validatedData);
        
        // Invalidate product cache on creation
        await flushCachePattern("products:*");

        BaseController.logAction("PRODUCT_CREATE", req.admin, { productId: product.id });
        BaseController.sendSuccess(res, "Product created successfully", { product }, 201);
    });

    // GET /api/products
    static getAll = BaseController.asyncHandler(async (req, res) => {
        const cacheKey = `products:all:${JSON.stringify(req.query)}:${req.admin ? 'admin' : 'user'}`;
        const cachedData = await getCache(cacheKey);

        if (cachedData) {
            return BaseController.sendSuccess(res, "Products fetched successfully (cached)", cachedData);
        }

        const query = {};//create empty filter object for mongodb

        if (!req.admin) {//if req is from normal users , only fetch active products
            query.status = { $in: ['active','draft'] };//used to fetch only active and draft products ,$in is used to check if the status is either active or draft
        }

        // Optional category filtering
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Optional search filtering (keyword search in name and description)
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: "i" } },
                { description: { $regex: req.query.search, $options: "i" } }
            ];
        }

        // Price Filtering 
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // Rating Filtering (minimum average rating)
        if (req.query.rating) {
            query.averageRating = { $gte: Number(req.query.rating) };
        }

        const page = parseInt(req.query.page) || 1;    //get page number from query parameter or default to 1
        const limit = parseInt(req.query.limit) || 10; //get limit from query parameter or default to 10
        const skip = (page - 1) * limit;           //calculate skip value

        // Sorting 
        let sortOption = { createdAt: -1 };
        if (req.query.sort === "price_asc") sortOption = { price: 1 };
        if (req.query.sort === "price_desc") sortOption = { price: -1 };

        const { products, total } = await ProductService.getProducts(query, skip, limit, sortOption);
        
        const responseData = { 
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };

        // Cache the products response for 10 minutes (600s)
        await setCache(cacheKey, responseData, 600);

        BaseController.sendSuccess(res, "Products fetched successfully", responseData);
    });

    // GET /api/admin/products/:id OR /api/user/products/:id
    static getById = BaseController.asyncHandler(async (req, res) => {
        const cacheKey = `product:id:${req.params.id}:${req.admin ? 'admin' : 'user'}`;
        const cachedProduct = await getCache(cacheKey);

        if (cachedProduct) {
            return BaseController.sendSuccess(res, "Product fetched successfully (cached)", { product: cachedProduct });
        }

        const product = await ProductService.getProductById(req.params.id);
        
        if (!product || (!req.admin && !(product.status === "active" || product.status === "draft"))) {
            return BaseController.sendError(res, "Product not found", 404);
        }

        await setCache(cacheKey, product, 600);

        BaseController.sendSuccess(res, "Product fetched successfully", { product });
    });

    // GET /api/user/products/slug/:slug
    static getBySlug = BaseController.asyncHandler(async (req, res) => {
        const product = await ProductService.getProductBySlug(req.params.slug);
        
        if (!product || (!req.admin && !(product.status == "active" || product.status == "draft"))) {
            return BaseController.sendError(res, "Product not found", 404);
        }

        BaseController.sendSuccess(res, "Product fetched successfully", { product });
    });

    // PUT /api/admin/products/:id
    static update = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(productValidation, req.body);
        const product = await ProductService.updateProduct(req.params.id, validatedData);
        
        // Invalidate product cache
        await flushCachePattern("products:*");
        await deleteCache(`product:id:${req.params.id}:admin`);
        await deleteCache(`product:id:${req.params.id}:user`);

        BaseController.logAction("PRODUCT_UPDATE", req.admin, { productId: product.id });
        BaseController.sendSuccess(res, "Product updated successfully", { product });
    });

    // DELETE /api/admin/products/:id
    static delete = BaseController.asyncHandler(async (req, res) => {
        const product = await ProductService.deleteProduct(req.params.id);
        
        // Invalidate product cache
        await flushCachePattern("products:*");
        await deleteCache(`product:id:${req.params.id}:admin`);
        await deleteCache(`product:id:${req.params.id}:user`);

        BaseController.logAction("PRODUCT_DELETE", req.admin, { productId: req.params.id });
        BaseController.sendSuccess(res, "Product deleted successfully", { product });
    });
}

module.exports = ProductController;
