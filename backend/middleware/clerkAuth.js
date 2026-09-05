const { getAuth } = require("@clerk/express");

const clerkAuth = (request, response, next) => {
	const { userId } = getAuth(request);

	if (!userId) {
		return response.status(401).json({ error: "Unauthorized" });
	}

	next();
};

module.exports = clerkAuth;
