const dashboardService = require("../services/managerDashboard.service");

// Return manager-only KPIs and team activity from the dashboard service.
const getDashboard = async (request, response, next) => {
	try {
		return response.json(await dashboardService.getManagerDashboard(request.user?._id, {
			dateFrom: request.query.dateFrom,
			dateTo: request.query.dateTo,
		}));
	} catch (error) {
		return next(error);
	}
};

module.exports = { getDashboard };