const mongoose = require("mongoose");

const approvalRuleSchema = new mongoose.Schema(
	{
		minDiscount: { type: Number, required: true, min: 0, max: 100 },
		maxDiscount: { type: Number, required: true, min: 0, max: 100 },
		approval: { type: String, enum: ["NONE", "MANAGER", "MANAGER_FINANCE"], required: true },
	},
	{ _id: false },
);

const approvalConfigSchema = new mongoose.Schema(
	{
		version: { type: Number, required: true },
		rules: { type: [approvalRuleSchema], required: true },
		updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
	},
	{ timestamps: true },
);

module.exports =
	mongoose.models.ApprovalConfig || mongoose.model("ApprovalConfig", approvalConfigSchema);
