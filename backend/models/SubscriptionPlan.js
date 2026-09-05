const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		billingInterval: { type: String, enum: ["MONTHLY", "YEARLY"], required: true },
		price: { type: Number, required: true, min: 0 },
		description: { type: String, trim: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports =
	mongoose.models.SubscriptionPlan || mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
