require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const connectDB = require("./config/mongoose_config");
const validateClerkEnv = require("./config/validateClerkEnv");
const errorHandler = require("./middleware/errorHandler");
const meRoutes = require("./routes/me.routes");
const internalRoutes = require("./routes/internal/index");
const portalRoutes = require("./routes/portal/index");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/me", meRoutes);
app.use("/api/internal", internalRoutes);
app.use("/api/portal", portalRoutes);

app.get("/", (_request, response) => {
	response.json({ message: "DealFlow360 API is running" });
});

app.get("/health", (_request, response) => {
	response.json({ status: "ok" });
});

app.use(errorHandler);

const startServer = async () => {
	try {
		validateClerkEnv();
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
