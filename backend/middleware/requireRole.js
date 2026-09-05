const requireRole = (allowedRoles) => (request, response, next) => {
	if (!request.user) {
		return response.status(401).json({ error: "Unauthorized" });
	}

	if (!allowedRoles.includes(request.user.role)) {
		return response.status(403).json({ error: "Forbidden" });
	}

	next();
};

module.exports = requireRole;
