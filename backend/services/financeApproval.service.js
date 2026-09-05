const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const Quotation = require("../models/Quotation");
const auditService = require("./audit.service");

const loadFinanceQuotation = async (quotationId) => {
	if (!mongoose.isValidObjectId(quotationId)) throw new AppError("Invalid quotation ID", 400);
	const quotation = await Quotation.findOne({
		_id: quotationId,
		approvalStage: "PENDING_FINANCE",
		status: "PENDING_APPROVAL",
		"approval.currentLevel": "FINANCE",
		"approval.status": "PENDING",
	});
	if (!quotation) throw new AppError("Quotation is not pending Finance approval", 404);
	return quotation;
};

const listPending = () => Quotation.find({
		approvalStage: "PENDING_FINANCE",
		status: "PENDING_APPROVAL",
		"approval.currentLevel": "FINANCE",
		"approval.status": "PENDING",
	}).populate("customer salesRep items.product").sort({ createdAt: -1 }).lean();

const decide = async (financeId, quotationId, action, note) => {
	const quotation = await loadFinanceQuotation(quotationId);
	const approved = action === "APPROVED";
	quotation.approval.status = approved ? "APPROVED" : "REJECTED";
	quotation.status = approved ? "APPROVED" : "REJECTED";
	quotation.approvalStage = approved ? "APPROVED" : "REJECTED";
	quotation.approvalAuditLog.push({
		userId: financeId,
		action: approved ? "APPROVED" : "REJECTED",
		note: note || undefined,
		timestamp: new Date(),
	});
	await quotation.save();
	await auditService.createAuditLog({
		action: approved ? "QUOTATION_FINANCE_APPROVED" : "QUOTATION_FINANCE_REJECTED",
		actor: financeId,
		entity: "Quotation",
		entityId: quotationId,
		details: note ? { note } : undefined,
	});
	return quotation;
};

module.exports = { listPending, approve: (id, quotationId) => decide(id, quotationId, "APPROVED"), reject: (id, quotationId, note) => decide(id, quotationId, "REJECTED", note) };
