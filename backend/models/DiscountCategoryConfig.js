const mongoose = require("mongoose");

const discountCategoryConfigSchema = new mongoose.Schema(
	{
		category: { type: String, required: true, trim: true, unique: true },
		maxDiscount: { type: Number, required: true, min: 0, max: 100 },
		approvalLevel: { type: String, enum: ["NONE", "MANAGER", "FINANCE"], default: "NONE" },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports =
	mongoose.models.DiscountCategoryConfig ||
	mongoose.model("DiscountCategoryConfig", discountCategoryConfigSchema);
