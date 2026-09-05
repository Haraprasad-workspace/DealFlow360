const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ _id: true },
);

const companySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	teams: {
		type: [teamSchema],
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports =
	mongoose.models.Company || mongoose.model("Company", companySchema);
