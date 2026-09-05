const logger = require("../utils/logger");

const errorHandler = (error, request, response, next) => {
	if (response.headersSent) {
		return next(error);
	}

	if (process.env.NODE_ENV === "development") {
		logger.error(error.stack || error.message);
	}

	if (error.message?.includes("Publishable key")) {
		return response.status(500).json({ success: false, message: "Server misconfiguration", errors: [] });
	}

	if (error.code === 11000) {
		return response.status(409).json({ success: false, message: "Resource already exists", errors: [] });
	}

	if (error.status === 401 || error.statusCode === 401) {
		return response.status(401).json({ success: false, message: "Unauthorized", errors: [] });
	}

	if (error.status === 403 || error.statusCode === 403) {
		return response.status(403).json({ success: false, message: "Forbidden", errors: [] });
	}

	if (error.name === "ValidationError") {
		return response.status(400).json({
			success: false,
			message: "Validation failed",
			errors: Object.values(error.errors).map((item) => ({ field: item.path, message: item.message })),
		});
	}

	if (error.name === "CastError") {
		return response.status(400).json({ success: false, message: "Invalid resource identifier", errors: [] });
	}

	const statusCode = error.statusCode || error.status || 500;
	const safeStatus = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
	return response.status(safeStatus).json({
		success: false,
		message: safeStatus === 500 ? "Internal server error" : error.message,
		errors: error.details || [],
	});
};

module.exports = errorHandler;
