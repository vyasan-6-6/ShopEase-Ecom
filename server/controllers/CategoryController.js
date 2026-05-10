const { CategoryService } = require("../services");
const BaseController = require("./BaseController");
const { categoryValidation } = require("../utils/validation");

class CategoryController extends BaseController {
    // POST /api/admin/categories
    static create = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(categoryValidation, req.body);
        const category = await CategoryService.createCategory(validatedData);
        BaseController.logAction("CATEGORY_CREATE", req.admin, { categoryId: category.id });
        BaseController.sendSuccess(res, "Category created successfully", { category }, 201);
    });

    // GET /api/admin/categories
    static getAll = BaseController.asyncHandler(async (req, res) => {
        const categories = await CategoryService.getCategories();
        BaseController.logAction("CATEGORY_FETCH", req.admin, { categories });
        BaseController.sendSuccess(res, "Categories fetched successfully", { categories });
    });

    // PUT /api/admin/categories/:id
    static update = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(categoryValidation, req.body);
        const category = await CategoryService.updateCategory(req.params.id, validatedData);
        BaseController.logAction("CATEGORY_UPDATE", req.admin, { categoryId:category.id });
        BaseController.sendSuccess(res, "Category updated successfully", { category });
    });

    // DELETE /api/admin/categories/:id
    static delete = BaseController.asyncHandler(async (req, res) => {
        const category = await CategoryService.deleteCategory(req.params.id);
        BaseController.logAction("CATEGORY_DELETE", req.admin, { categoryId: req.params.id });
        BaseController.sendSuccess(res, "Category deleted successfully", { category });
    });
}

module.exports = CategoryController;
