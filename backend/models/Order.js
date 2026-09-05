const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
	{
		product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
		quantity: { type: Number, required: true, min: 1 },
		unitPrice: { type: Number, min: 0 },
		discount: { type: Number, min: 0, max: 100 },
		tax: { type: Number, min: 0 },
		total: { type: Number, min: 0 },
		billingType: { type: String, enum: ["ONE_TIME", "RECURRING"] },
		subscriptionPlan: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "SubscriptionPlan",
		},
	},
	{ _id: false },
);

const orderSchema = new mongoose.Schema(
	{
		orderNumber: { type: String, required: true, unique: true },
		quotation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Quotation",
			required: true,
			unique: true,
		},
		customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
		salesRep: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		items: { type: [orderItemSchema], default: [] },
		subtotal: { type: Number, min: 0 },
		discountTotal: { type: Number, min: 0 },
		taxTotal: { type: Number, min: 0 },
		grandTotal: { type: Number, min: 0 },
		status: {
			type: String,
			enum: [
				"CONFIRMED",
				"PROCESSING",
				"FULFILLING",
				"PARTIALLY_FULFILLED",
				"COMPLETED",
				"CANCELLED",
			],
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
