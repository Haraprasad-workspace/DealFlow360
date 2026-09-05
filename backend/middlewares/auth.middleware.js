const authenticate = (req, res, next) => {
	if (!req.user) return res.status(401).json({ message: "Authentication required" });
	return next();
};

const authorize = (...roles) => (req, res, next) => {
	if (!req.user || !roles.includes(req.user.role)) {
		return res.status(403).json({ message: "Insufficient permissions" });
	}
	return next();
};

module.exports = { authenticate, authorize };
