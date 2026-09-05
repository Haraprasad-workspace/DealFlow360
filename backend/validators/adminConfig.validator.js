const Joi = require("joi");

const resource = Joi.string().valid("products", "discountTiers", "categoryDiscounts", "warehouses", "subscriptionPlans").required();
const id = Joi.object({ params: Joi.object({ resource, id: Joi.string().hex().length(24).required() }) });
const list = Joi.object({ query: Joi.object({ search: Joi.string().trim(), isActive: Joi.boolean() }), params: Joi.object({ resource }) });
const address = Joi.object({ street: Joi.string().allow(""), city: Joi.string().allow(""), state: Joi.string().allow(""), country: Joi.string().allow(""), pincode: Joi.string().allow("") });
const fields = {
	products: { sku: Joi.string().trim().min(1), name: Joi.string().trim().min(1), category: Joi.string().trim().min(1), description: Joi.string().allow(""), price: Joi.number().min(0), costPrice: Joi.number().min(0), unit: Joi.string().trim().min(1), taxRate: Joi.number().min(0), variants: Joi.array(), isRecurring: Joi.boolean(), isActive: Joi.boolean() },
	discountTiers: { customerTier: Joi.string().valid("BRONZE", "SILVER", "GOLD"), category: Joi.string().trim().min(1), maxDiscount: Joi.number().min(0).max(100), approvalLevel: Joi.string().valid("NONE", "MANAGER", "FINANCE"), isActive: Joi.boolean() },
	categoryDiscounts: { category: Joi.string().trim().min(1), maxDiscount: Joi.number().min(0).max(100), approvalLevel: Joi.string().valid("NONE", "MANAGER", "FINANCE"), isActive: Joi.boolean() },
	warehouses: { name: Joi.string().trim().min(1), code: Joi.string().trim().min(1), address, capacity: Joi.number().min(0), isActive: Joi.boolean() },
	subscriptionPlans: { name: Joi.string().trim().min(1), billingInterval: Joi.string().valid("MONTHLY", "YEARLY"), price: Joi.number().min(0), description: Joi.string().allow(""), isActive: Joi.boolean() },
};
fields.subscriptionPlans.billingInterval = Joi.string().valid("MONTHLY", "QUARTERLY", "YEARLY");
fields.subscriptionPlans.products = Joi.array().items(Joi.string().hex().length(24));
fields.subscriptionPlans.prorationRule = Joi.string().valid("NONE", "PRO_RATA");
fields.subscriptionPlans.cancellationRule = Joi.string().valid("IMMEDIATE", "END_OF_TERM");
fields.subscriptionPlans.partialRefundRule = Joi.string().valid("NONE", "REMAINING_DAYS");
fields.warehouses.shippingCostWeight = Joi.number().min(0);
fields.warehouses.stock = Joi.array().items(Joi.object({
	product: Joi.string().hex().length(24).required(),
	quantityOnHand: Joi.number().min(0),
	reorderThreshold: Joi.number().min(0),
	reorderQuantity: Joi.number().min(0),
}));
const create = (resourceName) => {
	const required = { ...fields[resourceName] };
	const requiredFields = resourceName === "products" ? ["name", "category", "price", "costPrice", "unit", "taxRate"] : resourceName === "discountTiers" ? ["customerTier", "category", "maxDiscount"] : resourceName === "categoryDiscounts" ? ["category", "maxDiscount"] : resourceName === "warehouses" ? ["name", "code", "capacity"] : ["name", "billingInterval", "price"];
	requiredFields.forEach((key) => { required[key] = required[key].required(); });
	return Joi.object({ params: Joi.object({ resource }), body: Joi.object(required).required() });
};
const update = (resourceName) => Joi.object({ params: Joi.object({ resource, id: Joi.string().hex().length(24).required() }), body: Joi.object(fields[resourceName]).min(1).required() });
const approvalConfig = Joi.object({
	body: Joi.object({
		rules: Joi.array().min(1).items(Joi.object({
			minDiscount: Joi.number().min(0).max(100).required(),
			maxDiscount: Joi.number().min(0).max(100).required(),
			approval: Joi.string().valid("NONE", "MANAGER", "MANAGER_FINANCE").required(),
		})).required(),
	}),
});

module.exports = { id, list, approvalConfig, create: Object.fromEntries(Object.keys(fields).map((key) => [key, create(key)])), update: Object.fromEntries(Object.keys(fields).map((key) => [key, update(key)])) };
