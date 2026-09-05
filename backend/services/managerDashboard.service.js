const Quotation = require("../models/Quotation");
const Order = require("../models/Order");
const managerQuotationService = require("./managerQuotation.service");

const getDashboardStats = async (managerId) => {
	const { query } = await managerQuotationService.getTeamFilter(managerId);
	const { repIds } = await managerQuotationService.getTeamRepIds(managerId);
	const orderQuery = { salesRep: { $in: repIds } };
	const [quotations, orders] = await Promise.all([
		Quotation.find(query).select("status grandTotal riskLevel").lean(),
		Order.find(orderQuery).select("status grandTotal").lean(),
	]);
	const completedOrders = orders.filter((order) => order.status !== "CANCELLED");
	const revenue = completedOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
	return {
		quotationCount: quotations.length,
		pendingApprovals: quotations.filter((item) => item.status === "PENDING_APPROVAL").length,
		approvedQuotations: quotations.filter((item) => item.status === "APPROVED").length,
		rejectedQuotations: quotations.filter((item) => item.status === "REJECTED").length,
		orderCount: completedOrders.length,
		revenue,
		highRiskDeals: quotations.filter((item) => item.riskLevel === "HIGH").length,
		conversionRate: quotations.length ? (completedOrders.length / quotations.length) * 100 : 0,
	};
};

const getTeamPerformance = async (managerId, filters = {}) => {
	const { query } = await managerQuotationService.getTeamFilter(managerId, filters);
	const quotationRows = await Quotation.find(query).select("salesRep status grandTotal").populate("salesRep", "name email").lean();
	const { repIds } = await managerQuotationService.getTeamRepIds(managerId);
	const orders = await Order.find({ salesRep: { $in: repIds }, ...((filters.dateFrom || filters.dateTo) ? { createdAt: { ...(filters.dateFrom ? { $gte: new Date(filters.dateFrom) } : {}), ...(filters.dateTo ? { $lte: new Date(filters.dateTo) } : {}) } } : {}) }).select("salesRep grandTotal status").lean();
	const byRep = new Map();
	quotationRows.forEach((row) => { const key = String(row.salesRep?._id || row.salesRep); const current = byRep.get(key) || { salesRep: row.salesRep, quotations: 0, approved: 0, revenue: 0, orders: 0 }; current.quotations += 1; if (row.status === "APPROVED") current.approved += 1; byRep.set(key, current); });
	orders.forEach((row) => { const key = String(row.salesRep); const current = byRep.get(key) || { salesRep: row.salesRep, quotations: 0, approved: 0, revenue: 0, orders: 0 }; if (row.status !== "CANCELLED") { current.orders += 1; current.revenue += row.grandTotal || 0; } byRep.set(key, current); });
	return [...byRep.values()].sort((left, right) => right.revenue - left.revenue);
};

const getRecentActivities = async (managerId) => {
	const { repIds } = await managerQuotationService.getTeamRepIds(managerId);
	const [quotations, orders] = await Promise.all([
		Quotation.find({ salesRep: { $in: repIds } }).select("quotationNumber status grandTotal salesRep createdAt").sort({ createdAt: -1 }).limit(10).populate("salesRep", "name").lean(),
		Order.find({ salesRep: { $in: repIds } }).select("orderNumber status grandTotal salesRep createdAt").sort({ createdAt: -1 }).limit(10).populate("salesRep", "name").lean(),
	]);
	return [...quotations.map((item) => ({ type: "QUOTATION", ...item })), ...orders.map((item) => ({ type: "ORDER", ...item }))].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).slice(0, 10);
};

const getRiskOverview = async (managerId) => {
	const { query } = await managerQuotationService.getTeamFilter(managerId);
	const rows = await Quotation.find(query).select("riskLevel riskScore grandTotal quotationNumber").sort({ riskScore: -1 }).lean();
	return { high: rows.filter((row) => row.riskLevel === "HIGH"), medium: rows.filter((row) => row.riskLevel === "MEDIUM"), low: rows.filter((row) => row.riskLevel === "LOW"), total: rows.length };
};

const getManagerDashboard = async (managerId, filters) => ({ stats: await getDashboardStats(managerId), teamPerformance: await getTeamPerformance(managerId, filters), recentActivities: await getRecentActivities(managerId), riskOverview: await getRiskOverview(managerId) });

module.exports = { getDashboardStats, getTeamPerformance, getRecentActivities, getRiskOverview, getManagerDashboard };