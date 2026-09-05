const Quotation = require("../models/Quotation");
const Order = require("../models/Order");
const managerQuotationService = require("./managerQuotation.service");
const managerOrderService = require("./managerOrder.service");

const getSalesReport = async (managerId, filters = {}) => {
	const quotations = (await managerQuotationService.getTeamQuotations(managerId, { ...filters, page: 1, limit: 10000 })).quotations;
	const orders = (await managerOrderService.getTeamOrders(managerId, { ...filters, page: 1, limit: 10000 })).orders;
	const activeOrders = orders.filter((order) => order.status !== "CANCELLED");
	return {
		revenue: activeOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0),
		orders: activeOrders.length,
		quotations: quotations.length,
		approvedQuotations: quotations.filter((quote) => quote.status === "APPROVED").length,
		rejectedQuotations: quotations.filter((quote) => quote.status === "REJECTED").length,
		conversionRate: quotations.length ? (activeOrders.length / quotations.length) * 100 : 0,
		averageDealValue: activeOrders.length ? activeOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0) / activeOrders.length : 0,
	};
};

const getTeamReport = async (managerId, filters = {}) => {
	const { repIds } = await managerQuotationService.getTeamRepIds(managerId);
	const quotations = await Quotation.find({ salesRep: { $in: repIds }, ...(filters.dateFrom || filters.dateTo ? { createdAt: { ...(filters.dateFrom ? { $gte: new Date(filters.dateFrom) } : {}), ...(filters.dateTo ? { $lte: new Date(filters.dateTo) } : {}) } } : {}) }).select("salesRep status").populate("salesRep", "name email").lean();
	const orders = await Order.find({ salesRep: { $in: repIds }, status: { $ne: "CANCELLED" } }).select("salesRep grandTotal").lean();
	const performance = new Map();
	quotations.forEach((quote) => { const key = String(quote.salesRep?._id || quote.salesRep); const item = performance.get(key) || { salesRep: quote.salesRep, quotations: 0, approved: 0, rejected: 0, orders: 0, revenue: 0 }; item.quotations += 1; if (quote.status === "APPROVED") item.approved += 1; if (quote.status === "REJECTED") item.rejected += 1; performance.set(key, item); });
	orders.forEach((order) => { const key = String(order.salesRep); const item = performance.get(key) || { salesRep: order.salesRep, quotations: 0, approved: 0, rejected: 0, orders: 0, revenue: 0 }; item.orders += 1; item.revenue += order.grandTotal || 0; performance.set(key, item); });
	return [...performance.values()].sort((left, right) => right.revenue - left.revenue);
};

const getProductReport = async (managerId, filters = {}) => {
	const { repIds } = await managerQuotationService.getTeamRepIds(managerId);
	const quotations = await Quotation.find({ salesRep: { $in: repIds }, ...(filters.dateFrom || filters.dateTo ? { createdAt: { ...(filters.dateFrom ? { $gte: new Date(filters.dateFrom) } : {}), ...(filters.dateTo ? { $lte: new Date(filters.dateTo) } : {}) } } : {}) }).select("items status").populate("items.product", "name category").lean();
	const products = new Map();
	quotations.forEach((quote) => quote.items.forEach((item) => { const product = item.product; if (!product) return; const key = String(product._id); const row = products.get(key) || { product, quotationLines: 0, quantity: 0, revenue: 0 }; row.quotationLines += 1; row.quantity += item.quantity || 0; if (["APPROVED", "CONFIRMED", "COMPLETED"].includes(quote.status)) row.revenue += item.total || 0; products.set(key, row); }));
	return [...products.values()].sort((left, right) => right.revenue - left.revenue);
};

module.exports = { getSalesReport, getTeamReport, getProductReport };