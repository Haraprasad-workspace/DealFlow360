const mongoose = require("mongoose");
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.models.AuditLog || mongoose.model("AuditLog", schema);
