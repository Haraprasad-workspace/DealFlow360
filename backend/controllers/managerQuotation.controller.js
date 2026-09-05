const quotationService = require("../services/managerQuotation.service");

const getManagerScope = (request) => ({
	teamId: request.user?.teamId,
	companyId: request.user?.companyId,
	salesRepId: request.query.salesRepId,
	status: request.query.status,
	riskLevel: request.query.riskLevel,
	search: request.query.search,
	dateFrom: request.query.dateFrom,
	dateTo: request.query.dateTo,
	page: Number.parseInt(request.query.page, 10) || 1,
	limit: Math.min(Number.parseInt(request.query.limit, 10) || 20, 100),
});

// Managers can monitor team quotations without changing Sales Rep ownership.
const getQuotations = async (request, response, next) => {
	try {
		return response.json(await quotationService.getTeamQuotations(request.user?._id, getManagerScope(request)));
	} catch (error) {
		return next(error);
	}
};

const getQuotationById = async (request, response, next) => {
	try {
		return response.json(await quotationService.getQuotationById(request.user?._id, request.params.quotationId));
	} catch (error) {
		return next(error);
	}
};

const getQuotationStats = async (request, response, next) => {
	try {
		return response.json(await quotationService.getQuotationStats(request.user?._id));
	} catch (error) {
		return next(error);
	}
};

module.exports = { getQuotations, getQuotationById, getQuotationStats };