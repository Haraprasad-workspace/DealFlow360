const mongoose = require("mongoose");
const { ALL_ROLES } = require("../constants/userRoles");

const permissionsSchema = new mongoose.Schema(
	{
		canApprove: {
			discountUpTo: {
				type: Number,
				default: null,
			},
		},
		canConfigure: {
			type: [String],
			default: [],
		},
	},
	{ _id: false },
);

const userSchema = new mongoose.Schema(
	{
		clerkUserId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			enum: ALL_ROLES,
			required: true,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			default: null,
		},
		teamId: {
			type: mongoose.Schema.Types.ObjectId,
			default: null,
		},
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Customer",
			default: null,
		},
		permissions: {
			type: permissionsSchema,
			required: true,
		},
		lastLoginAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
