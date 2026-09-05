const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
	{
		product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
		quantityOnHand: { type: Number, default: 0, min: 0 },
		reorderThreshold: { type: Number, default: 0, min: 0 },
		reorderQuantity: { type: Number, default: 0, min: 0 },
	},
	{ _id: false },
);

const warehouseSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		code: { type: String, required: true, trim: true, uppercase: true, unique: true },
		address: {
			street: { type: String, trim: true },
			city: { type: String, trim: true },
			state: { type: String, trim: true },
			country: { type: String, trim: true },
			pincode: { type: String, trim: true },
		},
		capacity: { type: Number, required: true, min: 0 },
		shippingCostWeight: { type: Number, default: 1, min: 0 },
		stock: { type: [stockSchema], default: [] },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.models.Warehouse || mongoose.model("Warehouse", warehouseSchema);
