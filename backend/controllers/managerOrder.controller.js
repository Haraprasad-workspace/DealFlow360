const orderService = require("../services/managerOrder.service");

const managerScope = (request) => ({
	teamId: request.user?.teamId,
	companyId: request.user?.companyId,
	salesRepId: request.query.salesRepId,
	status: request.query.status,
	customerId: request.query.customerId,
	dateFrom: request.query.dateFrom,
	dateTo: request.query.dateTo,
	page: Number.parseInt(request.query.page, 10) || 1,
	limit: Math.min(Number.parseInt(request.query.limit, 10) || 20, 100),
});

const getOrders = async (request, response, next) => {
	try {
		return response.json(await orderService.getTeamOrders(request.user?._id, managerScope(request)));
	} catch (error) {
		return next(error);
	}
};

const getOrderById = async (request, response, next) => {
	try {
		return response.json(await orderService.getOrderById(request.user?._id, request.params.orderId));
	} catch (error) {
		return next(error);
	}
};

const getOrderStats = async (request, response, next) => {
	try {
		return response.json(await orderService.getOrderStats(request.user?._id));
	} catch (error) {
		return next(error);
	}
};

module.exports = { getOrders, getOrderById, getOrderStats };