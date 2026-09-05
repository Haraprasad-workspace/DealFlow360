const mongoose = require("mongoose");
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.models.Warehouse || mongoose.model("Warehouse", schema);
