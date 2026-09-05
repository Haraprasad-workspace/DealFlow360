const validateClerkEnv = () => {
	const missing = [];

	if (!process.env.CLERK_SECRET_KEY) {
		missing.push("CLERK_SECRET_KEY");
	}

	if (!process.env.CLERK_PUBLISHABLE_KEY) {
		missing.push("CLERK_PUBLISHABLE_KEY");
	}

	if (missing.length > 0) {
		console.warn(
			`[auth] Missing backend env vars: ${missing.join(", ")}. /api/me will fail until these are set.`,
		);
	}
};

module.exports = validateClerkEnv;
