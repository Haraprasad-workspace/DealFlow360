const mongoose = require("mongoose");
const Order = require("../../models/Order");

const fail = (message, status = 400) => {
	const error = new Error(message);
	error.status = status;
	throw error;
};

const customerIdFor = (user) => {
	const customerId = user?.customerId;
	if (!customerId || !mongoose.isValidObjectId(customerId)) {
		fail("Customer account is not linked to a customer", 403);
	}
	return customerId;
};

const orderService = {
	async list(user, { page = 1, limit = 20, status, dateFrom, dateTo } = {}) {
		const filter = { customer: customerIdFor(user) };
		if (status) filter.status = status;
		if (dateFrom || dateTo) {
			filter.createdAt = {
				...(dateFrom ? { $gte: new Date(dateFrom) } : {}),
				...(dateTo ? { $lte: new Date(dateTo) } : {}),
			};
		}
		const [orders, total] = await Promise.all([
			Order.find(filter).populate("items.product quotation").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
			Order.countDocuments(filter),
		]);
		return { orders, total, page, limit, pages: Math.ceil(total / limit) };
	},

	async detail(user, orderId) {
		if (!mongoose.isValidObjectId(orderId)) fail("Invalid order ID");
		const order = await Order.findOne({ _id: orderId, customer: customerIdFor(user) }).populate("items.product quotation");
		if (!order) fail("Order not found", 404);
		return order;
	},
};

module.exports = orderService;
