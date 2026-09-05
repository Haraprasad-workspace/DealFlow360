const mongoose = require("mongoose");
const Quotation = require("../models/Quotation");
const Customer = require("../models/Customer");
require("../models/User");
const productService = require("./product.service");
const pricingService = require("./pricing.service");
const discountService = require("./discount.service");

const fail = (message, status = 400) => {
	const error = new Error(message);
	error.status = status;
	throw error;
};

const getSalesRepFilter = (userOrId) => {
	const id = typeof userOrId === "object" ? userOrId?.id || userOrId?._id : userOrId;
	if (mongoose.isValidObjectId(id)) return { salesRep: id };
	return id ? { salesRep: id } : {};
};

const normalizeItems = (items) => {
	if (!Array.isArray(items) || items.length === 0) fail("At least one quotation item is required");
	return items.map((item) => ({
		productId: item.productId || item.product?._id || item.product,
		quantity: item.quantity,
		discount: item.discount || 0,
	}));
};

const calculateQuotation = async (items, customer) => {
	const normalized = normalizeItems(items);
	const products = await productService.validateProducts(normalized.map((item) => item.productId));
	const productMap = new Map(products.map((product) => [String(product._id), product]));
	const enrichedItems = normalized.map((item) => ({ ...item, product: productMap.get(String(item.productId)) }));
	const pricing = pricingService.calculateQuotationPricing(enrichedItems, customer);
	const risk = await discountService.calculateRisk({ items: enrichedItems, customer });
	const approval = {
		required: risk.requiredApprovalStage !== "NONE_REQUIRED",
		currentLevel: risk.requiredApprovalStage === "PENDING_FINANCE"
			? "FINANCE"
			: risk.requiredApprovalStage === "PENDING_MANAGER"
				? "MANAGER"
				: "NONE",
		status: risk.requiredApprovalStage === "NONE_REQUIRED" ? "NOT_REQUIRED" : "PENDING",
	};
	return {
		...pricing,
		items: risk.linesWithStatus,
		riskScore: risk.riskScore,
		riskLevel: risk.riskLevel,
		blendedRisk: risk.blendedRisk,
		approvalStage: risk.requiredApprovalStage,
		approval,
		configWarnings: risk.configWarnings,
	};
};

const quotationService = {
	calculateQuotation,
	async createQuotation(customerId, salesRepId, items) {
		if (!mongoose.isValidObjectId(customerId)) fail("Invalid customer ID");
		const customer = await Customer.findOne({ _id: customerId, isDeleted: { $ne: true } });
		if (!customer) fail("Customer not found", 404);
		const calculated = await calculateQuotation(items, customer);
		return Quotation.create({
			quotationNumber: `QT-${Date.now()}`,
			customer: customerId,
			salesRep: salesRepId,
			...calculated,
			status: "DRAFT",
			approvalAuditLog: [],
		});
	},
	async getQuotations(filters = {}, salesRepId) {
		const { status, customer, search, dateFrom, dateTo, page = 1, limit = 20 } = filters;
		const filter = { ...getSalesRepFilter(salesRepId) };
		if (status) filter.status = status;
		if (customer) filter.customer = customer;
		if (search) filter.quotationNumber = new RegExp(search, "i");
		if (dateFrom || dateTo) filter.createdAt = { ...(dateFrom ? { $gte: new Date(dateFrom) } : {}), ...(dateTo ? { $lte: new Date(dateTo) } : {}) };
		const skip = (page - 1) * limit;
		const [quotations, total] = await Promise.all([
			Quotation.find(filter).populate("customer salesRep items.product").sort({ createdAt: -1 }).skip(skip).limit(limit),
			Quotation.countDocuments(filter),
		]);
		return { quotations, total, page, limit, pages: Math.ceil(total / limit) };
	},
	async getQuotationById(id, user) {
		if (!mongoose.isValidObjectId(id)) fail("Invalid quotation ID");
		return Quotation.findOne({ _id: id, ...getSalesRepFilter(user) }).populate("customer salesRep items.product");
	},
	async updateQuotation(id, data, user) {
		const quotation = await this.getEditableQuotation(id, user);
		if (data.customerId) {
			if (!mongoose.isValidObjectId(data.customerId)) fail("Invalid customer ID");
			if (!(await Customer.exists({ _id: data.customerId, isDeleted: { $ne: true } }))) fail("Customer not found", 404);
			quotation.customer = data.customerId;
		}
		const customer = await Customer.findById(quotation.customer);
		const calculated = await calculateQuotation(data.items || quotation.items, customer);
		Object.assign(quotation, calculated);
		return quotation.save();
	},
	async addQuotationItem(id, item, user) {
		const quotation = await this.getEditableQuotation(id, user);
		const customer = await Customer.findById(quotation.customer);
		const items = quotation.items.map((current) => ({ productId: current.product, quantity: current.quantity, discount: current.discount }));
		items.push(item);
		Object.assign(quotation, await calculateQuotation(items, customer));
		return quotation.save();
	},
	async updateQuotationItem(id, itemId, data, user) {
		const quotation = await this.getEditableQuotation(id, user);
		const index = quotation.items.findIndex((item, itemIndex) => String(item._id) === String(itemId) || itemIndex === Number(itemId));
		if (index < 0) fail("Quotation item not found", 404);
		const items = quotation.items.map((current) => ({ productId: current.product, quantity: current.quantity, discount: current.discount }));
		items[index] = { ...items[index], ...data };
		Object.assign(quotation, await calculateQuotation(items, await Customer.findById(quotation.customer)));
		return quotation.save();
	},
	async removeQuotationItem(id, itemId, user) {
		const quotation = await this.getEditableQuotation(id, user);
		const index = quotation.items.findIndex((item, itemIndex) => String(item._id) === String(itemId) || itemIndex === Number(itemId));
		if (index < 0) fail("Quotation item not found", 404);
		const items = quotation.items.map((current) => ({ productId: current.product, quantity: current.quantity, discount: current.discount }));
		items.splice(index, 1);
		Object.assign(quotation, await calculateQuotation(items, await Customer.findById(quotation.customer)));
		return quotation.save();
	},
	async submitQuotation(id, user) {
		const quotation = await this.getEditableQuotation(id, user);
		quotation.status = quotation.approval.required ? "PENDING_APPROVAL" : "APPROVED";
		quotation.approval.status = quotation.approval.required ? "PENDING" : "NOT_REQUIRED";
		quotation.approvalStage = quotation.approval.required
			? quotation.approvalStage
			: "APPROVED";
		quotation.approvalAuditLog.push({
			userId: user?._id || user?.id,
			userName: user?.name,
			action: "SUBMITTED",
			timestamp: new Date(),
		});
		return quotation.save();
	},
	async cancelQuotation(id, user) {
		const quotation = await Quotation.findOne({ _id: id, ...getSalesRepFilter(user) });
		if (!quotation) fail("Quotation not found", 404);
		if (!["DRAFT", "PENDING_APPROVAL"].includes(quotation.status)) fail("Quotation can no longer be cancelled", 409);
		quotation.status = "REJECTED";
		return quotation.save();
	},
	async getEditableQuotation(id, user) {
		const quotation = await Quotation.findOne({ _id: id, ...getSalesRepFilter(user) });
		if (!quotation) fail("Quotation not found", 404);
		if (!["DRAFT", "UNDER_NEGOTIATION"].includes(quotation.status)) fail("Quotation is not editable", 409);
		return quotation;
	},
	create: ({ customerId, items, salesRep }) => quotationService.createQuotation(customerId, salesRep, items),
	findMany: ({ user, ...filters }) => quotationService.getQuotations(filters, user),
	findById: (id, user) => quotationService.getQuotationById(id, user),
	recalculate: async (quotation, items) => Object.assign(quotation, await calculateQuotation(items, await Customer.findById(quotation.customer))),
};

module.exports = quotationService;
