const mongoose = require("mongoose");
const Product = require("../models/Product");

const fail = (message, status = 400) => {
	const error = new Error(message);
	error.status = status;
	throw error;
};

const productService = {
	async getProducts({ search, category, isRecurring, page = 1, limit = 20 } = {}) {
		const filter = { isActive: true };
		if (search) filter.name = new RegExp(search, "i");
		if (category) filter.category = category;
		if (isRecurring !== undefined) filter.isRecurring = isRecurring === true || isRecurring === "true";
		const skip = (page - 1) * limit;
		const [products, total] = await Promise.all([
			Product.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
			Product.countDocuments(filter),
		]);
		return { products, total, page, limit, pages: Math.ceil(total / limit) };
	},
	async getProductById(productId) {
		if (!mongoose.isValidObjectId(productId)) fail("Invalid product ID");
		const product = await Product.findOne({ _id: productId, isActive: true });
		if (!product) fail("Product not found", 404);
		return product;
	},
	async getProductsByCategory(category) {
		return this.getProducts({ category, page: 1, limit: 100 });
	},
	async validateProducts(productIds) {
		if (!Array.isArray(productIds) || productIds.length === 0) fail("At least one product is required");
		const uniqueIds = [...new Set(productIds.map(String))];
		if (uniqueIds.some((id) => !mongoose.isValidObjectId(id))) fail("Invalid product ID");
		const products = await Product.find({ _id: { $in: uniqueIds }, isActive: true });
		if (products.length !== uniqueIds.length) fail("One or more products were not found or are inactive", 404);
		return products;
	},
	findMany: (filters) => productService.getProducts(filters),
};

module.exports = productService;
