const approvalService = require("../services/managerApproval.service");

const managerScope = (request) => ({
	managerId: request.user?._id,
	teamId: request.user?.teamId,
	companyId: request.user?.companyId,
});

const getApprovals = async (request, response, next) => {
	try {
		return response.json(await approvalService.getPendingApprovals(request.user?._id, {
			page: Number.parseInt(request.query.page, 10) || 1,
			limit: Math.min(Number.parseInt(request.query.limit, 10) || 20, 100),
		}));
	} catch (error) {
		return next(error);
	}
};

const getApprovalById = async (request, response, next) => {
	try {
		return response.json(await approvalService.getApprovalDetails(request.user?._id, request.params.quotationId));
	} catch (error) {
		return next(error);
	}
};

// The service owns approval rules; the controller only passes the manager decision.
const approveQuotation = async (request, response, next) => {
	try {
		return response.json(await approvalService.approveQuotation(request.user?._id, request.params.quotationId));
	} catch (error) {
		return next(error);
	}
};

const rejectQuotation = async (request, response, next) => {
	try {
		return response.json(await approvalService.rejectQuotation(request.user?._id, request.params.quotationId, request.body?.reason));
	} catch (error) {
		return next(error);
	}
};

module.exports = { getApprovals, getApprovalById, approveQuotation, rejectQuotation };