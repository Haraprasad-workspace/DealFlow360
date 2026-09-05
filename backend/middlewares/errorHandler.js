const errorHandler = (error, _request, response, _next) => {
	const isDevelopment = process.env.NODE_ENV === "development";
	if (isDevelopment) console.error(error.stack || error);

	if (error.code === 11000) {
		return response.status(409).json({ success: false, message: "Resource already exists" });
	}
	if (error.name === "ValidationError") {
		return response.status(400).json({
			success: false,
			message: "Validation failed",
			errors: Object.values(error.errors).map((item) => ({ field: item.path, message: item.message })),
		});
	}
	if (error.name === "CastError") {
		return response.status(400).json({ success: false, message: "Invalid resource identifier" });
	}

	const statusCode = error.statusCode || error.status || 500;
	const safeStatus = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
	return response.status(safeStatus).json({
		success: false,
		message: safeStatus === 500 ? "Internal server error" : error.message,
		...(error.details ? { errors: error.details } : {}),
	});
};

module.exports = errorHandler;