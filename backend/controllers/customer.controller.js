const customerService = require("../services/customer.service");

const getPagination = (query) => ({
	page: Math.max(Number.parseInt(query.page, 10) || 1, 1),
	limit: Math.min(Math.max(Number.parseInt(query.limit, 10) || 20, 1), 100),
});

const createCustomer = async (req, res, next) => {
	try {
		return res.status(201).json(await customerService.createCustomer(req.body));
	} catch (error) {
		if (error.status) return res.status(error.status).json({ message: error.message });
		return next(error);
	}
};

const getCustomers = async (req, res, next) => {
	try {
		return res.json(await customerService.getCustomers({ ...getPagination(req.query), search: req.query.search, tier: req.query.tier }));
	} catch (error) {
		return next(error);
	}
};

const getCustomerById = async (req, res, next) => {
	try {
		return res.json(await customerService.getCustomerById(req.params.customerId));
	} catch (error) {
		if (error.status) return res.status(error.status).json({ message: error.message });
		return next(error);
	}
};

const updateCustomer = async (req, res, next) => {
	try {
		return res.json(await customerService.updateCustomer(req.params.customerId, req.body));
	} catch (error) {
		if (error.status) return res.status(error.status).json({ message: error.message });
		return next(error);
	}
};

const deleteCustomer = async (req, res, next) => {
	try {
		return res.json({ message: "Customer deleted", customer: await customerService.deleteCustomer(req.params.customerId) });
	} catch (error) {
		if (error.status) return res.status(error.status).json({ message: error.message });
		return next(error);
	}
};

module.exports = { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer };
