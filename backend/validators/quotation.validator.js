const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const item = Joi.object({
	productId: objectId,
	product: objectId,
	quantity: Joi.number().integer().min(1).required(),
	unitPrice: Joi.number().min(0),
	discount: Joi.number().min(0).max(100),
	tax: Joi.number().min(0),
	total: Joi.number().min(0),
	margin: Joi.number(),
}).xor("productId", "product");

const createQuotation = Joi.object({
	body: Joi.object({
		customerId: objectId.required(),
		items: Joi.array().items(item).min(1).required(),
	}),
});

const updateQuotation = Joi.object({
	body: Joi.object({ customerId: objectId }).min(1).required(),
	params: Joi.object({ quotationId: objectId.required() }),
});

const quotationId = Joi.object({ params: Joi.object({ quotationId: objectId.required() }) });
const itemParams = Joi.object({
	params: Joi.object({ quotationId: objectId.required(), itemId: Joi.string().min(1).required() }),
});
const listQuotations = Joi.object({
	query: Joi.object({
		page: Joi.number().integer().min(1),
		limit: Joi.number().integer().min(1).max(100),
		status: Joi.string(),
		customerId: objectId,
		search: Joi.string().trim(),
		dateFrom: Joi.date(),
		dateTo: Joi.date(),
	}),
});
const addItem = Joi.object({
	body: Joi.object({
		productId: objectId,
		product: objectId,
		quantity: Joi.number().integer().min(1).required(),
		discount: Joi.number().min(0).max(100),
		unitPrice: Joi.number().min(0),
	}).xor("productId", "product"),
	params: Joi.object({ quotationId: objectId.required() }),
});
const updateItem = Joi.object({
	body: Joi.object({ quantity: Joi.number().integer().min(1), discount: Joi.number().min(0).max(100), unitPrice: Joi.number().min(0) }).min(1).required(),
	params: Joi.object({ quotationId: objectId.required(), itemId: Joi.string().min(1).required() }),
});

module.exports = { createQuotation, updateQuotation, quotationId, addItem, updateItem, itemParams, listQuotations };
