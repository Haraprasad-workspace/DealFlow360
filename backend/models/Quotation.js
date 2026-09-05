const mongoose = require("mongoose");

const quotationItemSchema = new mongoose.Schema(
	{
		product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
		quantity: { type: Number, required: true, min: 1 },
		unitPrice: { type: Number, min: 0 },
		discount: { type: Number, min: 0, max: 100 },
		lineStatus: { type: String, enum: ["OK", "OVER", "NO_CONFIG"] },
		overagePoints: { type: Number, min: 0 },
		effectiveLimitPct: { type: Number, min: 0, max: 100 },
		tax: { type: Number, min: 0 },
		total: { type: Number, min: 0 },
		margin: { type: Number },
	},
	{ _id: false },
);

const quotationSchema = new mongoose.Schema(
	{
		quotationNumber: { type: String, required: true, unique: true },
		customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
		salesRep: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		items: { type: [quotationItemSchema], default: [] },
		subtotal: { type: Number, min: 0 },
		discountTotal: { type: Number, min: 0 },
		taxTotal: { type: Number, min: 0 },
		grandTotal: { type: Number, min: 0 },
		margin: { type: Number },
		riskScore: { type: Number, min: 0 },
		riskLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH"] },
		blendedRisk: { type: String, enum: ["LOW", "MEDIUM", "HIGH"] },
		approvalStage: {
			type: String,
			enum: ["NONE_REQUIRED", "PENDING_MANAGER", "PENDING_FINANCE", "APPROVED", "RETURNED", "REJECTED"],
		},
		status: {
			type: String,
			enum: [
				"DRAFT",
				"PENDING_APPROVAL",
				"APPROVED",
				"REJECTED",
				"UNDER_NEGOTIATION",
				"CONFIRMED",
				"FULFILLING",
				"COMPLETED",
			],
		},
		approval: {
			required: { type: Boolean, default: false },
			currentLevel: { type: String, enum: ["NONE", "MANAGER", "FINANCE"] },
			status: {
				type: String,
				enum: ["NOT_REQUIRED", "PENDING", "APPROVED", "REJECTED"],
			},
		},
		approvalAuditLog: [{
			userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			userName: { type: String },
			action: { type: String, enum: ["SUBMITTED", "APPROVED", "RETURNED", "REJECTED", "RESUBMITTED"] },
			note: { type: String },
			timestamp: { type: Date, default: Date.now },
		}],
	},
	{ timestamps: true },
);

module.exports =
	mongoose.models.Quotation || mongoose.model("Quotation", quotationSchema);
