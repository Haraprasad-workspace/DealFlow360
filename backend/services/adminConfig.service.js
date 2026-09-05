const mongoose = require("mongoose");
const Product = require("../models/Product");
const DiscountTierConfig = require("../models/DiscountTierConfig");
const DiscountCategoryConfig = require("../models/DiscountCategoryConfig");
const Warehouse = require("../models/Warehouse");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const ApprovalConfig = require("../models/ApprovalConfig");

const resources = { products: Product, discountTiers: DiscountTierConfig, categoryDiscounts: DiscountCategoryConfig, warehouses: Warehouse, subscriptionPlans: SubscriptionPlan };
const fail = (message, status = 400) => { const error = new Error(message); error.status = status; throw error; };
const getModel = (resource) => resources[resource] || fail("Unknown admin resource", 404);
const validateId = (id) => { if (!mongoose.isValidObjectId(id)) fail("Invalid resource ID"); };

const adminConfigService = {
	async list(resource, { search, isActive } = {}) {
		const Model = getModel(resource);
		const filter = {};
		if (isActive !== undefined) filter.isActive = isActive === true || isActive === "true";
		if (search) {
			const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
			filter.$or = resource === "products"
				? [{ name: pattern }, { category: pattern }, { sku: pattern }]
				: resource === "warehouses"
					? [{ name: pattern }, { code: pattern }]
					: resource === "categoryDiscounts"
						? [{ category: pattern }]
						: [{ name: pattern }, { category: pattern }, { customerTier: pattern }];
		}
		return Model.find(filter).sort({ createdAt: -1 });
	},
	async get(resource, id) {
		validateId(id);
		const item = await getModel(resource).findById(id);
		if (!item) fail("Resource not found", 404);
		return item;
	},
	async create(resource, data) { return getModel(resource).create(data); },
	async update(resource, id, data) {
		validateId(id);
		const item = await getModel(resource).findByIdAndUpdate(id, data, { new: true, runValidators: true });
		if (!item) fail("Resource not found", 404);
		return item;
	},
	async remove(resource, id) {
		validateId(id);
		const item = await getModel(resource).findByIdAndDelete(id);
		if (!item) fail("Resource not found", 404);
		return item;
	},
	async saveApprovalConfig(data, userId) {
		const latest = await ApprovalConfig.findOne().sort({ version: -1 });
		return ApprovalConfig.create({
			version: (latest?.version || 0) + 1,
			rules: data.rules,
			updatedBy: userId || null,
		});
	},
	async getApprovalConfig() {
		return ApprovalConfig.findOne().sort({ version: -1 });
	},
};

module.exports = adminConfigService;
