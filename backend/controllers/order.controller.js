const orderService = require("../services/order.service");

const handleError = (error, res, next) => {
	if (error.status) return res.status(error.status).json({ message: error.message });
	return next(error);
};

const createOrderFromQuotation = async (req, res, next) => {
	try {
		return res.status(201).json(await orderService.createOrderFromQuotation(req.params.quotationId, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const getOrders = async (req, res, next) => {
	try {
		const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
		const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
		return res.json(await orderService.getOrders({ page, limit, status: req.query.status, customer: req.query.customer || req.query.customerId, dateFrom: req.query.dateFrom, dateTo: req.query.dateTo }, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const getOrderById = async (req, res, next) => {
	try {
		return res.json(await orderService.getOrderById(req.params.orderId, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const cancelOrder = async (req, res, next) => {
	try {
		return res.json(await orderService.cancelOrder(req.params.orderId, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

module.exports = { createOrderFromQuotation, getOrders, getOrderById, cancelOrder };
