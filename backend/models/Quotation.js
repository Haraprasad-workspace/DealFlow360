const mongoose = require("mongoose");
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.models.Quotation || mongoose.model("Quotation", schema);
