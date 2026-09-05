const mongoose = require("mongoose");

const discountRuleSchema = new mongoose.Schema(
	{
		customerTier: { type: String, enum: ["BRONZE", "SILVER", "GOLD"], required: true },
		category: { type: String, required: true },
		maxDiscount: { type: Number, required: true, min: 0, max: 100 },
		approvalLevel: { type: String, enum: ["NONE", "MANAGER", "FINANCE"], default: "NONE" },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports =
	mongoose.models.DiscountRule || mongoose.model("DiscountRule", discountRuleSchema);
