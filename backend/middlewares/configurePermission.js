const { USER_ROLES } = require("../constants/userRoles");

const configurePermission = (scope) => (req, res, next) => {
	if (req.user?.role === USER_ROLES.ADMIN || req.user?.permissions?.canConfigure?.includes(scope)) return next();
	return res.status(403).json({ message: "Insufficient configuration permissions" });
};

module.exports = configurePermission;
