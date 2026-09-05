const errorHandler = (error, request, response, next) => {
	if (response.headersSent) {
		return next(error);
	}

	console.error("[api error]", error);

	if (error.message?.includes("Publishable key")) {
		return response.status(500).json({
			error: "Server misconfiguration: missing Clerk keys",
			details:
				"Set CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY in backend/.env",
		});
	}

	if (error.status === 401 || error.statusCode === 401) {
		return response.status(401).json({ error: "Unauthorized" });
	}

	if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	return response.status(500).json({
		error: "Internal server error",
		details:
			process.env.NODE_ENV === "development" ? error.message : undefined,
	});
};

module.exports = errorHandler;
