const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
	{
		action: { type: String, required: true },
		actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		entity: { type: String, required: true },
		entityId: { type: mongoose.Schema.Types.ObjectId },
		details: { type: mongoose.Schema.Types.Mixed },
	},
	{ timestamps: true },
);

module.exports = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
