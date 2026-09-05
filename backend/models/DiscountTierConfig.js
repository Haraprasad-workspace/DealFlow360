const mongoose = require("mongoose");

const discountTierConfigSchema = new mongoose.Schema(
	{
		customerTier: { type: String, enum: ["BRONZE", "SILVER", "GOLD"], required: true },
		category: { type: String, required: true, trim: true },
		maxDiscount: { type: Number, required: true, min: 0, max: 100 },
		approvalLevel: { type: String, enum: ["NONE", "MANAGER", "FINANCE"], default: "NONE" },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

discountTierConfigSchema.index({ customerTier: 1, category: 1 }, { unique: true });

module.exports =
	mongoose.models.DiscountTierConfig ||
	mongoose.model("DiscountTierConfig", discountTierConfigSchema);
