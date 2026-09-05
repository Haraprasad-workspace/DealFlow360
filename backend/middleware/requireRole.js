const requireRole = (allowedRoles) => (request, response, next) => {
	if (!request.user) {
		console.warn(`[requireRole 401] Unauthorized access attempt at ${request.originalUrl}`);
		return response.status(401).json({
			error: "Unauthorized",
			message: "User session is invalid or not authenticated.",
		});
	}

	const userRole = request.user.role;

	if (!allowedRoles.includes(userRole)) {
		console.warn(
			`[requireRole 403] Access denied at ${request.originalUrl} | User: ${request.user.email} | Role: '${userRole}' | Allowed: [${allowedRoles.join(", ")}]`,
		);
		return response.status(403).json({
			error: "Forbidden",
			message: `Access denied for role ${userRole}. Required role: ${allowedRoles.join(" or ")}.`,
			userRole,
			allowedRoles,
		});
	}

	console.info(
		`[requireRole 200] Access granted at ${request.originalUrl} | User: ${request.user.email} (${userRole})`,
	);
	next();
};

module.exports = requireRole;
