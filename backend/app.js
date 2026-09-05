require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const connectDB = require("./config/mongoose_config");
const validateClerkEnv = require("./config/validateClerkEnv");
const meRoutes = require("./routes/me.routes");
const internalRoutes = require("./routes/internal/index");
const portalRoutes = require("./routes/portal/index");
const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const quotationRoutes = require("./routes/quotation.routes");
const orderRoutes = require("./routes/order.routes");
const managerDashboardRoutes = require("./routes/managerDashboard.routes");
const managerQuotationRoutes = require("./routes/managerQuotation.routes");
const managerApprovalRoutes = require("./routes/managerApproval.routes");
const managerOrderRoutes = require("./routes/managerOrder.routes");
const managerReportRoutes = require("./routes/managerReport.routes");
const requestLogger = require("./middlewares/requestLogger");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);
// Clerk middleware makes the authenticated request context available to routes.
app.use(clerkMiddleware());

// Authenticated feature routes sync Clerk users before role checks run.
app.use("/api/me", meRoutes);
app.use("/api/internal", internalRoutes);
app.use("/api/portal", portalRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/manager/dashboard", managerDashboardRoutes);
app.use("/api/manager/quotations", managerQuotationRoutes);
app.use("/api/manager/approvals", managerApprovalRoutes);
app.use("/api/manager/orders", managerOrderRoutes);
app.use("/api/manager/reports", managerReportRoutes);

app.get("/", (_request, response) => {
	response.json({ message: "DealFlow360 API is running" });
});

app.get("/health", (_request, response) => {
	response.json({ status: "ok" });
});

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
	try {
		validateClerkEnv();
		await connectDB();

		app.listen(port, () => {
			logger.info(`Server running on port ${port}`);
		});
	} catch (error) {
		console.error("Unable to start server:", error.message);
		process.exit(1);
	}
};

if (require.main === module) startServer();

module.exports = app;
