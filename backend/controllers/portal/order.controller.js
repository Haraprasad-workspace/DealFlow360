const service = require("../../services/portal/order.service");

const handle = (error, res, next) => error.status ? res.status(error.status).json({ message: error.message }) : next(error);

const pagination = (query) => ({
	page: Math.max(Number.parseInt(query.page, 10) || 1, 1),
	limit: Math.min(Math.max(Number.parseInt(query.limit, 10) || 20, 1), 100),
});

const list = async (req, res, next) => {
	try {
		return res.json(await service.list(req.user, { ...pagination(req.query), status: req.query.status, dateFrom: req.query.dateFrom, dateTo: req.query.dateTo }));
	} catch (error) {
		return handle(error, res, next);
	}
};

const detail = async (req, res, next) => {
	try {
		return res.json(await service.detail(req.user, req.params.orderId));
	} catch (error) {
		return handle(error, res, next);
	}
};

module.exports = { list, detail };
