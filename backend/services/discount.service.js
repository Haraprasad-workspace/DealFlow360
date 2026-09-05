const DiscountTierConfig = require("../models/DiscountTierConfig");
const DiscountCategoryConfig = require("../models/DiscountCategoryConfig");
const ApprovalConfig = require("../models/ApprovalConfig");
const { calculateBlendedRisk } = require("./riskEngine");

const calculateRisk = async ({ items, customer }) => {
	const categories = [...new Set((items || []).map((item) => item.product?.category || item.category).filter(Boolean))];
	const [tierConfigs, categoryConfigs, approvalConfig] = await Promise.all([
		DiscountTierConfig.find({ customerTier: customer?.tier, category: { $in: categories }, isActive: true }).lean(),
		DiscountCategoryConfig.find({ category: { $in: categories }, isActive: true }).lean(),
		ApprovalConfig.findOne().sort({ version: -1 }).lean(),
	]);
	if (!customer?.tier) throw new Error("Customer tier is required for discount risk calculation");
	if (!approvalConfig?.rules?.length) throw new Error("Discount approval configuration is not configured");

	const result = calculateBlendedRisk({
		items,
		customerTier: customer.tier,
		tierConfigs,
		categoryConfigs,
		approvalRules: approvalConfig.rules,
	});
	return {
		...result,
		riskScore: result.blendedOverage,
		riskLevel: result.blendedRisk,
		violations: result.linesWithStatus.filter((line) => line.lineStatus === "OVER"),
	};
};

const validateDiscounts = async (items, customer) => {
	if (!Array.isArray(items) || items.length === 0) {
		const error = new Error("At least one quotation item is required");
		error.status = 400;
		throw error;
	}
	if (items.some((item) => Number(item.discount || 0) < 0 || Number(item.discount || 0) > 100)) {
		const error = new Error("Discount must be between 0 and 100");
		error.status = 400;
		throw error;
	}
	return customer ? calculateRisk({ items, customer }) : items;
};

module.exports = { calculateRisk, validateDiscounts };
