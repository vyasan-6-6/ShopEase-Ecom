const Category = require("../models/Category");
const { ErrorFactory } = require("../utils/errors");

class CategoryService {
    static async createCategory(data) {
        const category = new Category(data);
        return await category.save();
    }

    static async getCategories(query = {}) {
        return await Category.find(query).sort({ createdAt: -1 });
    }

    static async getCategoryById(id) {
        const category = await Category.findById(id);
        if (!category) {
            ErrorFactory.notFound("Category not found");
        }
        return category;
    }

    static async updateCategory(id, data) {
        const category = await Category.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );
        if (!category) {
            ErrorFactory.notFound("Category not found");
        }
        return category;
    }

    static async deleteCategory(id) {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            ErrorFactory.notFound("Category not found");
        }
        return category;
    }
}

module.exports =  CategoryService;
