const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const Order = require("../models/Order");
require("../models/Customer");
require("../models/Product");
require("../models/User");
require("../models/Quotation");
const managerQuotationService = require("./managerQuotation.service");

const getOrderFilter = async (managerId, filters = {}) => {
	const { repIds } = await managerQuotationService.getTeamRepIds(managerId);
	const query = { salesRep: { $in: repIds } };
	if (filters.salesRepId) {
		if (!mongoose.isValidObjectId(filters.salesRepId) || !repIds.some((id) => String(id) === String(filters.salesRepId))) throw new AppError("Sales Representative is outside the manager team", 403);
		query.salesRep = filters.salesRepId;
	}
	if (filters.status) query.status = filters.status;
	if (filters.customerId) query.customer = filters.customerId;
	if (filters.dateFrom || filters.dateTo) query.createdAt = { ...(filters.dateFrom ? { $gte: new Date(filters.dateFrom) } : {}), ...(filters.dateTo ? { $lte: new Date(filters.dateTo) } : {}) };
	return query;
};

const getTeamOrders = async (managerId, filters = {}) => {
	const query = await getOrderFilter(managerId, filters);
	const page = Math.max(filters.page || 1, 1);
	const limit = filters.limit > 100 ? Math.min(filters.limit, 10000) : Math.min(filters.limit || 20, 100);
	const [orders, total] = await Promise.all([
		Order.find(query).populate("customer salesRep quotation items.product").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
		Order.countDocuments(query),
	]);
	return { orders, total, page, limit, pages: Math.ceil(total / limit) };
};

const getOrderById = async (managerId, orderId) => {
	if (!mongoose.isValidObjectId(orderId)) throw new AppError("Invalid order ID", 400);
	const query = await getOrderFilter(managerId);
	const order = await Order.findOne({ ...query, _id: orderId }).populate("customer salesRep quotation items.product").lean();
	if (!order) throw new AppError("Order not found in manager team", 404);
	return order;
};

const getOrderStats = async (managerId) => {
	const query = await getOrderFilter(managerId);
	const orders = await Order.find(query).select("status grandTotal").lean();
	return {
		total: orders.length,
		active: orders.filter((order) => !["COMPLETED", "CANCELLED"].includes(order.status)).length,
		completed: orders.filter((order) => order.status === "COMPLETED").length,
		cancelled: orders.filter((order) => order.status === "CANCELLED").length,
		revenue: orders.filter((order) => order.status !== "CANCELLED").reduce((sum, order) => sum + (order.grandTotal || 0), 0),
	};
};

const getManagerOrders = (filters) => getTeamOrders(filters.managerId, filters);
const getManagerOrderById = (orderId, scope) => getOrderById(scope.managerId, orderId);

module.exports = { getTeamOrders, getOrderById, getOrderStats, getManagerOrders, getManagerOrderById };