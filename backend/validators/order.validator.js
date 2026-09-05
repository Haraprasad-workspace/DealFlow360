const Joi = require("joi");

const objectId = Joi.string().hex().length(24).required();

const createOrder = Joi.object({
	params: Joi.object({ quotationId: objectId }),
});

const orderId = Joi.object({
	params: Joi.object({ orderId: objectId }),
});
const listOrders = Joi.object({
	query: Joi.object({
		page: Joi.number().integer().min(1),
		limit: Joi.number().integer().min(1).max(100),
		status: Joi.string(),
		customerId: Joi.string().hex().length(24),
		dateFrom: Joi.date(),
		dateTo: Joi.date(),
	}),
});

module.exports = { createOrder, orderId, listOrders };
