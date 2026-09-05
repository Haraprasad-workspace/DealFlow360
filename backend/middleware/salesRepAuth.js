const clerkAuth = require("./clerkAuth");
const syncUser = require("./syncUser");
const requireRole = require("./requireRole");
const { USER_ROLES } = require("../constants/userRoles");

// Allow Sales Reps, Sales Managers, and Admins to access sales operation routes.
const salesRepAuth = [
	clerkAuth,
	syncUser,
	requireRole([USER_ROLES.SALES_REP, USER_ROLES.SALES_MANAGER, USER_ROLES.ADMIN]),
];

module.exports = salesRepAuth;