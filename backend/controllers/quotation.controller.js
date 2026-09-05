const quotationService = require("../services/quotation.service");
const recommendationService = require("../services/recommendation.service");

const pagination = (query) => ({
	page: Math.max(Number.parseInt(query.page, 10) || 1, 1),
	limit: Math.min(Math.max(Number.parseInt(query.limit, 10) || 20, 1), 100),
});

const handleError = (error, res, next) => {
	if (error.status) return res.status(error.status).json({ message: error.message });
	return next(error);
};

const salesRepId = (req) => req.user?.id || req.user?._id || req.body.salesRep;

const createQuotation = async (req, res, next) => {
	try {
		const { customerId, items } = req.body;
		const repId = salesRepId(req);
		if (!customerId || !Array.isArray(items) || !repId) return res.status(400).json({ message: "customerId, items, and sales representative are required" });
		return res.status(201).json(await quotationService.createQuotation(customerId, repId, items));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const getQuotations = async (req, res, next) => {
	try {
		return res.json(await quotationService.getQuotations({ ...pagination(req.query), status: req.query.status, customer: req.query.customer || req.query.customerId, search: req.query.search, dateFrom: req.query.dateFrom, dateTo: req.query.dateTo }, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const getQuotationById = async (req, res, next) => {
	try {
		const quotation = await quotationService.getQuotationById(req.params.quotationId, req.user);
		if (!quotation) return res.status(404).json({ message: "Quotation not found" });
		return res.json(quotation);
	} catch (error) {
		return handleError(error, res, next);
	}
};

const updateQuotation = async (req, res, next) => {
	try {
		return res.json(await quotationService.updateQuotation(req.params.quotationId, req.body, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const addQuotationItem = async (req, res, next) => {
	try {
		return res.json(await quotationService.addQuotationItem(req.params.quotationId, req.body, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const updateQuotationItem = async (req, res, next) => {
	try {
		return res.json(await quotationService.updateQuotationItem(req.params.quotationId, req.params.itemId, req.body, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const removeQuotationItem = async (req, res, next) => {
	try {
		return res.json(await quotationService.removeQuotationItem(req.params.quotationId, req.params.itemId, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const submitQuotation = async (req, res, next) => {
	try {
		return res.json(await quotationService.submitQuotation(req.params.quotationId, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const cancelQuotation = async (req, res, next) => {
	try {
		return res.json(await quotationService.cancelQuotation(req.params.quotationId, req.user));
	} catch (error) {
		return handleError(error, res, next);
	}
};

const getRecommendations = async (req, res, next) => {
	try {
		const quotation = await quotationService.getQuotationById(req.params.quotationId, req.user);
		if (!quotation) return res.status(404).json({ message: "Quotation not found" });
		return res.json(await recommendationService.getRecommendations(quotation.items));
	} catch (error) {
		return handleError(error, res, next);
	}
};

module.exports = { createQuotation, getQuotations, getQuotationById, updateQuotation, addQuotationItem, updateQuotationItem, removeQuotationItem, submitQuotation, cancelQuotation, getRecommendations };
