const productService = require("../services/product.service");

const getPagination = (query) => ({
	page: Math.max(Number.parseInt(query.page, 10) || 1, 1),
	limit: Math.min(Math.max(Number.parseInt(query.limit, 10) || 20, 1), 100),
});

const publicProduct = (product) => {
	const plainProduct = product.toObject ? product.toObject() : product;
	const { costPrice, ...safeProduct } = plainProduct;
	return safeProduct;
};

const getProducts = async (req, res, next) => {
	try {
		const result = await productService.getProducts({ ...getPagination(req.query), search: req.query.search, category: req.query.category, isRecurring: req.query.isRecurring });
		return res.json({ ...result, products: result.products.map(publicProduct) });
	} catch (error) {
		if (error.status) return res.status(error.status).json({ message: error.message });
		return next(error);
	}
};

const getProductById = async (req, res, next) => {
	try {
		return res.json(publicProduct(await productService.getProductById(req.params.productId)));
	} catch (error) {
		if (error.status) return res.status(error.status).json({ message: error.message });
		return next(error);
	}
};

const getProductsByCategory = async (req, res, next) => {
	try {
		const result = await productService.getProductsByCategory(req.params.category);
		return res.json({ ...result, products: result.products.map(publicProduct) });
	} catch (error) {
		if (error.status) return res.status(error.status).json({ message: error.message });
		return next(error);
	}
};

module.exports = { getProducts, getProductById, getProductsByCategory };
