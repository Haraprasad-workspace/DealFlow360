const mongoose = require("mongoose");
const Order = require("../models/Order");
const Quotation = require("../models/Quotation");
require("../models/User");

const fail = (message, status = 400) => {
	const error = new Error(message);
	error.status = status;
	throw error;
};

const salesRepFilter = (userOrId) => {
	if (mongoose.isValidObjectId(userOrId)) return { salesRep: userOrId };
	const id = typeof userOrId === "object" ? userOrId?.id || userOrId?._id : userOrId;
	return id ? { salesRep: id } : {};
};

const orderService = {
	async createOrderFromQuotation(quotationId, user) {
		if (!mongoose.isValidObjectId(quotationId)) fail("Invalid quotation ID");
		const quotation = await Quotation.findOne({ _id: quotationId, ...salesRepFilter(user?.id || user?._id || user) });
		if (!quotation) fail("Quotation not found", 404);
		if (quotation.status !== "APPROVED" && quotation.status !== "CONFIRMED") fail("Only approved quotations can become orders", 409);
		if (!quotation.items.length) fail("Quotation must contain at least one item");
		if (await Order.exists({ quotation: quotation._id })) fail("Quotation has already been converted", 409);

		return Order.create({
			orderNumber: `ORD-${Date.now()}`,
			quotation: quotation._id,
			customer: quotation.customer,
			salesRep: quotation.salesRep,
			items: quotation.items.map((item) => ({ ...item.toObject(), billingType: "ONE_TIME" })),
			subtotal: quotation.subtotal,
			discountTotal: quotation.discountTotal,
			taxTotal: quotation.taxTotal,
			grandTotal: quotation.grandTotal,
			status: "CONFIRMED",
		});
	},
	async getOrders({ status, customer, dateFrom, dateTo, page = 1, limit = 20 } = {}, salesRepId) {
		const filter = { ...salesRepFilter(salesRepId) };
		if (status) filter.status = status;
		if (customer) filter.customer = customer;
		if (dateFrom || dateTo) filter.createdAt = { ...(dateFrom ? { $gte: new Date(dateFrom) } : {}), ...(dateTo ? { $lte: new Date(dateTo) } : {}) };
		const [orders, total] = await Promise.all([
			Order.find(filter).populate("customer salesRep quotation items.product").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
			Order.countDocuments(filter),
		]);
		return { orders, total, page, limit, pages: Math.ceil(total / limit) };
	},
	async getOrderById(orderId, user) {
		if (!mongoose.isValidObjectId(orderId)) fail("Invalid order ID");
		const order = await Order.findOne({ _id: orderId, ...salesRepFilter(user?.id || user?._id || user) }).populate("customer salesRep quotation items.product");
		if (!order) fail("Order not found", 404);
		return order;
	},
	async cancelOrder(orderId, user) {
		if (!mongoose.isValidObjectId(orderId)) fail("Invalid order ID");
		const order = await Order.findOne({ _id: orderId, ...salesRepFilter(user?.id || user?._id || user) });
		if (!order) fail("Order not found", 404);
		if (["FULFILLING", "PARTIALLY_FULFILLED", "COMPLETED", "CANCELLED"].includes(order.status)) fail("Order can no longer be cancelled", 409);
		order.status = "CANCELLED";
		return order.save();
	},
	createFromQuotation: (quotationId, user) => orderService.createOrderFromQuotation(quotationId, user),
};

module.exports = orderService;
