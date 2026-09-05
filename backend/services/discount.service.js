const DiscountRule = require("../models/DiscountRule");

const defaultLimits = {
	BRONZE: 5,
	SILVER: 10,
	GOLD: 15,
};

const getAllowedDiscount = async (customerTier = "BRONZE", category) => {
	const rule = await DiscountRule.findOne({ customerTier, category, isActive: true }).lean();
	return rule?.maxDiscount ?? defaultLimits[customerTier] ?? defaultLimits.BRONZE;
};

const validateLineDiscount = async (item, customer) => {
	const requestedDiscount = Number(item.discount || 0);
	const allowedDiscount = await getAllowedDiscount(customer?.tier, item.product?.category || item.category);
	const excess = Math.max(0, requestedDiscount - allowedDiscount);
	return { allowed: excess === 0, allowedDiscount, requestedDiscount, excess };
};

const calculateRisk = async (quotation) => {
	const results = await Promise.all((quotation.items || []).map((item) => validateLineDiscount(item, quotation.customer)));
	const violations = results.filter((result) => !result.allowed);
	const excess = violations.reduce((total, result) => total + result.excess, 0);
	const riskScore = Math.min(100, excess * 5 + violations.length * 10);
	return {
		riskScore,
		riskLevel: riskScore >= 70 ? "HIGH" : riskScore >= 30 ? "MEDIUM" : "LOW",
		violations,
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

module.exports = { getAllowedDiscount, validateLineDiscount, calculateRisk, validateDiscounts };
