const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
		},
	},
	{ timestamps: true },
);

module.exports =
	mongoose.models.Customer || mongoose.model("Customer", customerSchema);
