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
	await auditService.createAuditLog({ action, actor: managerId, entity: "Quotation", entityId: quotationId, details });
};

const approveQuotation = async (managerId, quotationId) => {
	const quotation = await loadPendingQuotation(managerId, quotationId);

	// Evaluate max discount rate and risk parameters for multi-level approval flow
	const maxDiscount = Math.max(0, ...(quotation.items || []).map((i) => i.discount || 0));
	const isHighDiscount = maxDiscount >= 15 || (quotation.riskScore && quotation.riskScore >= 40) || (quotation.margin && quotation.margin < 15);

	// Check if this requires second-level Finance Manager approval
	if (isHighDiscount && quotation.approval?.currentLevel !== "FINANCE") {
		quotation.approval.currentLevel = "FINANCE";
		quotation.approval.approvedByManagerAt = new Date();
		quotation.approval.approvedByManager = managerId;
		quotation.approval.requiresFinanceApproval = true;
		quotation.approval.status = "PENDING";
		quotation.status = "PENDING_APPROVAL";
		await quotation.save();
		await writeAudit("QUOTATION_MANAGER_APPROVED_ESCALATED_FINANCE", managerId, quotationId, {
			maxDiscount,
			reason: "High discount rate requires 2nd-level Finance Manager approval",
		});
		return {
			quotation,
			message: `Manager approval granted. Escalated to Finance Manager (Discount rate: ${maxDiscount}%).`,
		};
	}

	// Fully approved for billing
	quotation.approval.status = "APPROVED";
	quotation.approval.currentLevel = "COMPLETED";
	quotation.approval.approvedByManagerAt = new Date();
	quotation.approval.approvedByManager = managerId;
	quotation.status = "APPROVED";
	await quotation.save();
	await writeAudit("QUOTATION_APPROVED", managerId, quotationId);
	return {
		quotation,
		message: "Quotation fully approved for billing and order conversion.",
	};
};

const rejectQuotation = async (managerId, quotationId, reason) => {
	if (!reason || !String(reason).trim()) throw new AppError("Rejection reason is required", 400);
	const quotation = await loadPendingQuotation(managerId, quotationId);
	quotation.approval.status = "REJECTED";
	quotation.approval.rejectionReason = String(reason).trim();
	quotation.status = "REJECTED";
	await quotation.save();
	await writeAudit("QUOTATION_REJECTED", managerId, quotationId, { reason: String(reason).trim() });
	return quotation;
};

module.exports = { getPendingApprovals, getApprovalDetails, approveQuotation, rejectQuotation };