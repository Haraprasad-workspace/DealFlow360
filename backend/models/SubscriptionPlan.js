const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		billingInterval: { type: String, enum: ["MONTHLY", "QUARTERLY", "YEARLY"], required: true },
		price: { type: Number, required: true, min: 0 },
		description: { type: String, trim: true },
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
		prorationRule: { type: String, enum: ["NONE", "PRO_RATA"], default: "PRO_RATA" },
		cancellationRule: { type: String, enum: ["IMMEDIATE", "END_OF_TERM"], default: "END_OF_TERM" },
		partialRefundRule: { type: String, enum: ["NONE", "REMAINING_DAYS"], default: "REMAINING_DAYS" },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports =
	mongoose.models.SubscriptionPlan || mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
