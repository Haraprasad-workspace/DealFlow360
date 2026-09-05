const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},
		phone: { type: String },
		company: { type: String, required: true, trim: true },
		tier: {
			type: String,
			enum: ["BRONZE", "SILVER", "GOLD"],
			required: true,
			default: "BRONZE",
		},
		address: {
			street: String,
			city: String,
			state: String,
			country: String,
			pincode: String,
		},
		isDeleted: { type: Boolean, default: false },
		deletedAt: { type: Date },
	},
	{ timestamps: true },
);

module.exports =
	mongoose.models.Customer || mongoose.model("Customer", customerSchema);
