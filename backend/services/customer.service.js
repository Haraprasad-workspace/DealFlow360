const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Quotation = require("../models/Quotation");
const Order = require("../models/Order");

const fail = (message, status = 400) => {
	const error = new Error(message);
	error.status = status;
	throw error;
};

const validateId = (id) => {
	if (!mongoose.isValidObjectId(id)) fail("Invalid customer ID");
};

const validateData = (data, partial = false) => {
	const required = ["name", "email", "company"];
	if (!partial && required.some((field) => !data[field])) fail("name, email, and company are required");
	if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) fail("Invalid email format");
	if (data.tier && !["BRONZE", "SILVER", "GOLD"].includes(data.tier)) fail("Invalid customer tier");
};

const customerService = {
	async createCustomer(data) {
		validateData(data);
		if (await Customer.exists({ email: data.email.toLowerCase(), isDeleted: { $ne: true } })) fail("Email already exists", 409);
		return Customer.create({ ...data, email: data.email.toLowerCase(), tier: data.tier || "BRONZE" });
	},
	async getCustomers({ search, tier, page = 1, limit = 20 } = {}) {
		const filter = { isDeleted: { $ne: true } };
		if (tier) filter.tier = tier;
		if (search) {
			const pattern = new RegExp(search, "i");
			filter.$or = [{ name: pattern }, { email: pattern }, { company: pattern }];
		}
		const skip = (page - 1) * limit;
		const [customers, total] = await Promise.all([
			Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
			Customer.countDocuments(filter),
		]);
		return { customers, total, page, limit, pages: Math.ceil(total / limit) };
	},
	async getCustomerById(customerId) {
		validateId(customerId);
		const customer = await Customer.findOne({ _id: customerId, isDeleted: { $ne: true } });
		if (!customer) fail("Customer not found", 404);
		return customer;
	},
	async updateCustomer(customerId, data) {
		validateId(customerId);
		validateData(data, true);
		if (data.email) {
			data.email = data.email.toLowerCase();
			if (await Customer.exists({ email: data.email, _id: { $ne: customerId }, isDeleted: { $ne: true } })) fail("Email already exists", 409);
		}
		const customer = await Customer.findOneAndUpdate({ _id: customerId, isDeleted: { $ne: true } }, data, { new: true, runValidators: true });
		if (!customer) fail("Customer not found", 404);
		return customer;
	},
	async deleteCustomer(customerId) {
		validateId(customerId);
		if (await this.hasActiveTransactions(customerId)) fail("Customer has active quotations or orders", 409);
		const customer = await Customer.findOneAndUpdate({ _id: customerId, isDeleted: { $ne: true } }, { isDeleted: true, deletedAt: new Date() }, { new: true });
		if (!customer) fail("Customer not found", 404);
		return customer;
	},
	async hasActiveTransactions(customerId) {
		const [quotation, order] = await Promise.all([
			Quotation.exists({ customer: customerId, status: { $nin: ["COMPLETED", "REJECTED"] } }),
			Order.exists({ customer: customerId, status: { $nin: ["COMPLETED", "CANCELLED"] } }),
		]);
		return Boolean(quotation || order);
	},
	create: (data) => customerService.createCustomer(data),
	findMany: (filters) => customerService.getCustomers(filters),
};

module.exports = customerService;
