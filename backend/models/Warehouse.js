const mongoose = require("mongoose");

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
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.models.Warehouse || mongoose.model("Warehouse", warehouseSchema);
