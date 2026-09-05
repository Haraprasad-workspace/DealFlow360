const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const Quotation = require("../models/Quotation");
const approvalService = require("./approval.service");
const managerQuotationService = require("./managerQuotation.service");
const auditService = require("./audit.service");

const getPendingApprovals = async (managerId, filters = {}) => {
	const { query } = await managerQuotationService.getTeamFilter(managerId, { ...filters, status: "PENDING_APPROVAL" });
	const page = Math.max(filters.page || 1, 1);
	const limit = Math.min(filters.limit || 20, 100);
	const [quotations, total] = await Promise.all([
		Quotation.find(query).populate("customer salesRep items.product").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
		Quotation.countDocuments(query),
	]);
	return { quotations, total, page, limit, pages: Math.ceil(total / limit) };
};

const getApprovalDetails = (managerId, quotationId) => managerQuotationService.getQuotationById(managerId, quotationId);

const loadPendingQuotation = async (managerId, quotationId) => {
	if (!mongoose.isValidObjectId(quotationId)) throw new AppError("Invalid quotation ID", 400);
	const { query } = await managerQuotationService.getTeamFilter(managerId);
	const quotation = await Quotation.findOne({ ...query, _id: quotationId });
	if (!quotation) throw new AppError("Quotation not found in manager team", 404);
	if (quotation.status !== "PENDING_APPROVAL" || quotation.approval?.status !== "PENDING") throw new AppError("Quotation is not pending approval", 409);
	return quotation;
};

const writeAudit = async (action, managerId, quotationId, details) => {
	// AuditLog currently has a minimal schema; keep the write isolated for later enrichment.
	await auditService.createAuditLog({ action, actor: managerId, entity: "Quotation", entityId: quotationId, details });
};

const approveQuotation = async (managerId, quotationId) => {
	const quotation = await loadPendingQuotation(managerId, quotationId);
	const decision = approvalService.determineApproval({ grandTotal: quotation.grandTotal, margin: quotation.margin, riskScore: quotation.riskScore });
	if (!decision.required) throw new AppError("Quotation does not require approval", 409);
	const needsFinanceApproval = quotation.approvalStage === "PENDING_FINANCE";
	quotation.approval.status = needsFinanceApproval ? "PENDING" : "APPROVED";
	if (!needsFinanceApproval) {
		quotation.status = "APPROVED";
		quotation.approvalStage = "APPROVED";
	}
	quotation.approvalAuditLog.push({
		userId: managerId,
		action: "APPROVED",
		note: needsFinanceApproval ? "Manager approved; Finance approval remains required." : undefined,
		timestamp: new Date(),
	});
	await quotation.save();
	await writeAudit("QUOTATION_APPROVED", managerId, quotationId);
	return quotation;
};

const rejectQuotation = async (managerId, quotationId, reason) => {
	if (!reason || !String(reason).trim()) throw new AppError("Rejection reason is required", 400);
	const quotation = await loadPendingQuotation(managerId, quotationId);
	quotation.approval.status = "REJECTED";
	quotation.status = "REJECTED";
	await quotation.save();
	await writeAudit("QUOTATION_REJECTED", managerId, quotationId, { reason: String(reason).trim() });
	return quotation;
};

module.exports = { getPendingApprovals, getApprovalDetails, approveQuotation, rejectQuotation };