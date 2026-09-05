const reportService = require("../services/managerReport.service");

const reportScope = (request) => ({
	teamId: request.user?.teamId,
	companyId: request.user?.companyId,
	salesRepId: request.query.salesRepId,
	dateFrom: request.query.dateFrom,
	dateTo: request.query.dateTo,
	groupBy: request.query.groupBy,
});

const getSalesReport = async (request, response, next) => {
	try {
		return response.json(await reportService.getSalesReport(request.user?._id, reportScope(request)));
	} catch (error) {
		return next(error);
	}
};

const getTeamReport = async (request, response, next) => {
	try {
		return response.json(await reportService.getTeamReport(request.user?._id, reportScope(request)));
	} catch (error) {
		return next(error);
	}
};

const getProductReport = async (request, response, next) => {
	try {
		return response.json(await reportService.getProductReport(request.user?._id, reportScope(request)));
	} catch (error) {
		return next(error);
	}
};

module.exports = { getSalesReport, getTeamReport, getProductReport };