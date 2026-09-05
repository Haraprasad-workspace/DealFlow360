const Joi = require("joi");

const variant = Joi.object({
	attribute: Joi.string().trim().required(),
	values: Joi.array().items(Joi.string()).required(),
	extraPrice: Joi.number().min(0),
});

const productFields = {
	name: Joi.string().trim().min(1),
	category: Joi.string().trim().min(1),
	description: Joi.string().allow(""),
	price: Joi.number().min(0),
	costPrice: Joi.number().min(0),
	unit: Joi.string().trim().min(1),
	taxRate: Joi.number().min(0),
	variants: Joi.array().items(variant),
	isRecurring: Joi.boolean(),
	isActive: Joi.boolean(),
};

const createProduct = Joi.object({ body: Joi.object({
	...productFields,
	name: productFields.name.required(),
	category: productFields.category.required(),
	price: productFields.price.required(),
	costPrice: productFields.costPrice.required(),
	unit: productFields.unit.required(),
	taxRate: productFields.taxRate.required(),
}) });

const updateProduct = Joi.object({ body: Joi.object(productFields).min(1).required() });
const productId = Joi.object({ params: Joi.object({ productId: Joi.string().hex().length(24).required() }) });
const listProducts = Joi.object({
	query: Joi.object({
		page: Joi.number().integer().min(1),
		limit: Joi.number().integer().min(1).max(100),
		search: Joi.string().trim(),
		category: Joi.string().trim(),
		isRecurring: Joi.boolean(),
	}),
});

module.exports = { createProduct, updateProduct, productId, listProducts };
