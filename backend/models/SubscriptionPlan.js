const mongoose = require("mongoose");
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.models.SubscriptionPlan || mongoose.model("SubscriptionPlan", schema);
