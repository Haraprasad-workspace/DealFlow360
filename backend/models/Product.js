const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
	{
		attribute: { type: String, required: true },
		values: { type: [String], default: [] },
		extraPrice: { type: Number, default: 0, min: 0 },
	},
	{ _id: false },
);

const productSchema = new mongoose.Schema(
	{
		sku: { type: String, trim: true, uppercase: true, unique: true, sparse: true },
		name: { type: String, required: true, trim: true },
		category: { type: String, required: true },
		description: { type: String },
		price: { type: Number, required: true, min: 0 },
		costPrice: { type: Number, required: true, min: 0 },
		unit: { type: String, required: true },
		taxRate: { type: Number, required: true, min: 0 },
		variants: { type: [variantSchema], default: [] },
		isRecurring: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports =
	mongoose.models.Product || mongoose.model("Product", productSchema);
