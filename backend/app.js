require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongoose_config");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_request, response) => {
	response.json({ message: "DealFlow360 API is running" });
});

app.get("/health", (_request, response) => {
	response.json({ status: "ok" });
});

const startServer = async () => {
	try {
		await connectDB();

		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (error) {
		console.error("Unable to start server:", error.message);
		process.exit(1);
	}
};

startServer();

module.exports = app;
