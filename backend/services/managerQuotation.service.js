const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const User = require("../models/User");
const Quotation = require("../models/Quotation");
require("../models/Customer");
require("../models/Product");

const getTeamRepIds = async (managerId) => {
	if (!mongoose.isValidObjectId(managerId)) throw new AppError("Invalid manager ID", 400);

	const manager = await User.findOne({ _id: managerId }).lean();
	if (!manager) throw new AppError("User not found", 404);

	const teamFilter = { role: "SALES_REP" };
	if (manager.teamId) {
		teamFilter.teamId = manager.teamId;
	}
	if (manager.companyId) {
		teamFilter.companyId = manager.companyId;
	}

	const reps = await User.find(teamFilter).select("_id").lean();
	return { manager, repIds: reps.map((rep) => rep._id) };
};

const dateFilter = (dateFrom, dateTo) => {
	if (!dateFrom && !dateTo) return {};
	return { createdAt: { ...(dateFrom ? { $gte: new Date(dateFrom) } : {}), ...(dateTo ? { $lte: new Date(dateTo) } : {}) } };
};

const getTeamFilter = async (managerId, filters = {}) => {
	const { repIds } = await getTeamRepIds(managerId);
	const query = { salesRep: { $in: repIds }, ...dateFilter(filters.dateFrom, filters.dateTo) };
	if (filters.salesRepId) {
		if (!mongoose.isValidObjectId(filters.salesRepId) || !repIds.some((id) => String(id) === String(filters.salesRepId))) {
			throw new AppError("Sales Representative is outside the manager team", 403);
		}
		query.salesRep = filters.salesRepId;
	}
	if (filters.status) query.status = filters.status;
	if (filters.riskLevel) query.riskLevel = filters.riskLevel;
	if (filters.customerId) query.customer = filters.customerId;
	if (filters.search) query.quotationNumber = new RegExp(filters.search, "i");
	return { query, repIds };
};

const getTeamQuotations = async (managerId, filters = {}) => {
	const { query } = await getTeamFilter(managerId, filters);
	const page = Math.max(filters.page || 1, 1);
	const limit = filters.limit > 100 ? Math.min(filters.limit, 10000) : Math.min(filters.limit || 20, 100);
	const [quotations, total] = await Promise.all([
		Quotation.find(query).populate("customer salesRep items.product").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
		Quotation.countDocuments(query),
	]);
	return { quotations, total, page, limit, pages: Math.ceil(total / limit) };
};

const getQuotationById = async (managerId, quotationId) => {
	if (!mongoose.isValidObjectId(quotationId)) throw new AppError("Invalid quotation ID", 400);
	const { query } = await getTeamFilter(managerId);
	const quotation = await Quotation.findOne({ ...query, _id: quotationId }).populate("customer salesRep items.product").lean();
	if (!quotation) throw new AppError("Quotation not found in manager team", 404);
	return quotation;
};

const getQuotationStats = async (managerId) => {
	const { query } = await getTeamFilter(managerId);
	const [quotations, total] = await Promise.all([Quotation.find(query).select("status grandTotal riskLevel").lean(), Quotation.countDocuments(query)]);
	const revenue = quotations.filter((item) => ["APPROVED", "CONFIRMED", "FULFILLING", "COMPLETED"].includes(item.status)).reduce((sum, item) => sum + (item.grandTotal || 0), 0);
	return {
		total,
		pendingApprovals: quotations.filter((item) => item.status === "PENDING_APPROVAL").length,
		approved: quotations.filter((item) => item.status === "APPROVED").length,
		rejected: quotations.filter((item) => item.status === "REJECTED").length,
		highRisk: quotations.filter((item) => item.riskLevel === "HIGH").length,
		revenue,
	};
};

module.exports = { getTeamRepIds, getTeamFilter, getTeamQuotations, getQuotationById, getQuotationStats };