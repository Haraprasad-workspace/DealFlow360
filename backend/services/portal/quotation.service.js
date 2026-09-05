const mongoose = require("mongoose");
const Quotation = require("../../models/Quotation");

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

const quotationService = {
	async list(user, { page = 1, limit = 20, status, dateFrom, dateTo } = {}) {
		const filter = { customer: customerIdFor(user) };
		if (status) filter.status = status;
		if (dateFrom || dateTo) {
			filter.createdAt = {
				...(dateFrom ? { $gte: new Date(dateFrom) } : {}),
				...(dateTo ? { $lte: new Date(dateTo) } : {}),
			};
		}
		const [quotations, total] = await Promise.all([
			Quotation.find(filter).select("-margin -riskScore -riskLevel -approval").populate("items.product").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
			Quotation.countDocuments(filter),
		]);
		return { quotations, total, page, limit, pages: Math.ceil(total / limit) };
	},

	async detail(user, quotationId) {
		if (!mongoose.isValidObjectId(quotationId)) fail("Invalid quotation ID");
		const quotation = await Quotation.findOne({ _id: quotationId, customer: customerIdFor(user) })
			.select("-margin -riskScore -riskLevel -approval")
			.populate("items.product");
		if (!quotation) fail("Quotation not found", 404);
		return quotation;
	},
};

module.exports = quotationService;
