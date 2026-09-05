const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
	const databaseUri = process.env.MONGO_URI || process.env.db_uri;

	if (!databaseUri) {
		throw new Error("Missing db_uri in the environment variables");
	}

	await mongoose.connect(databaseUri);
	logger.info("MongoDB connected");
};

module.exports = connectDB;
