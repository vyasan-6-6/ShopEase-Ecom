const Product = require("../models/Product");
const { ErrorFactory } = require("../utils/errors");

class ProductService {
    static async createProduct(data) {
        const product = new Product(data);
        return product.save();//product.save() saves the document and returns the saved product.
    }

    static async getProducts(query = {}, skip = 0, limit = 0) {
        const products = await Product.find(query)
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Product.countDocuments(query);
        return { products, total };
    }

    static async getProductById(id) {
        const product = await Product.findById(id).populate("category", "name slug");
        if (!product) {
            throw ErrorFactory.notFound("Product not found");
        }
        return product;
    }

    static async getProductBySlug(slug) {
        const product = await Product.findOne({ slug }).populate("category", "name slug");
        if (!product) {
            throw ErrorFactory.notFound("Product not found");
        }
        return product;
    }

    static async updateProduct(id, data) {
        const product = await Product.findByIdAndUpdate(
            id,
            { $set: data },//$set operator is used to update the fields of the document.only update fields which are sent in the request body
            { returnDocument: 'after', runValidators: true }//returnDocument: 'after' returns updated document and runValidators:true validates the updated document
        ).populate("category", "name slug");

        if (!product) {
            throw ErrorFactory.notFound("Product not found");
        }
        return product;
    }

    static async deleteProduct(id) {
        const product = await Product.findByIdAndDelete(id);//it returns the document that was deleted. If no document is found, it returns null.
        if (!product) {
            throw ErrorFactory.notFound("Product not found");
        }
        return product;
    }
}

module.exports = ProductService;
