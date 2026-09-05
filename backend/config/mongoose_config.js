const mongoose = require("mongoose");

const connectDB = async () => {
	const databaseUri = process.env.db_uri;

	if (!databaseUri) {
		throw new Error("Missing db_uri in the environment variables");
	}

	await mongoose.connect(databaseUri);
	console.log("MongoDB connected");
};

module.exports = connectDB;
