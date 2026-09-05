const Joi = require("joi");

const objectId = Joi.string().hex().length(24).required();
const dateRange = {
	dateFrom: Joi.date(),
	dateTo: Joi.date().greater(Joi.ref("dateFrom")),
};

const dashboardQuery = Joi.object({ query: Joi.object(dateRange) });
const quotationList = Joi.object({
	query: Joi.object({
		page: Joi.number().integer().min(1),
		limit: Joi.number().integer().min(1).max(100),
		status: Joi.string(),
		riskLevel: Joi.string().valid("LOW", "MEDIUM", "HIGH"),
		salesRepId: Joi.string().hex().length(24),
		customerId: Joi.string().hex().length(24),
		search: Joi.string().trim(),
		...dateRange,
	}),
});
const quotationId = Joi.object({ params: Joi.object({ quotationId: objectId }) });
const approvalList = Joi.object({ query: Joi.object({ page: Joi.number().integer().min(1), limit: Joi.number().integer().min(1).max(100) }) });
const rejection = Joi.object({
	body: Joi.object({ reason: Joi.string().trim().min(1).required() }),
	params: Joi.object({ quotationId: objectId }),
});
const orderList = Joi.object({
	query: Joi.object({
		page: Joi.number().integer().min(1),
		limit: Joi.number().integer().min(1).max(100),
		status: Joi.string(),
		salesRepId: Joi.string().hex().length(24),
		customerId: Joi.string().hex().length(24),
		...dateRange,
	}),
});
const orderId = Joi.object({ params: Joi.object({ orderId: objectId }) });
const reportQuery = Joi.object({ query: Joi.object({ salesRepId: Joi.string().hex().length(24), groupBy: Joi.string(), ...dateRange }) });

module.exports = { dashboardQuery, quotationList, quotationId, approvalList, rejection, orderList, orderId, reportQuery };