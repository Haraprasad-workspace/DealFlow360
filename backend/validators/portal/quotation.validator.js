const Joi = require("joi");

const objectId = Joi.string().hex().length(24).required();
const list = Joi.object({
	query: Joi.object({
		page: Joi.number().integer().min(1),
		limit: Joi.number().integer().min(1).max(100),
		status: Joi.string().valid("DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "UNDER_NEGOTIATION", "CONFIRMED", "FULFILLING", "COMPLETED"),
		dateFrom: Joi.date(),
		dateTo: Joi.date(),
	}),
});
const detail = Joi.object({ params: Joi.object({ quotationId: objectId }) });

module.exports = { list, detail };
