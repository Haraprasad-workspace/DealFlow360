const Product = require("../models/Product");

const getRecommendations = async (quotationItems = []) => {
	const selectedIds = quotationItems.map((item) => String(item.product?._id || item.productId || item.product));
	const products = await Product.find({ _id: { $nin: selectedIds }, isActive: true }).limit(10);
	return products
		.filter((product) => product.price > product.costPrice)
		.map((product, index) => ({
			product,
			reason: "Active product with positive margin",
			marginDelta: product.price - product.costPrice,
			promotion: null,
			score: products.length - index,
		}))
		.sort((left, right) => right.score - left.score);
};

const addRecommendationToQuotation = (product) => product;

module.exports = { getRecommendations, addRecommendationToQuotation };
