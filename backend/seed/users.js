const { buildPermissionsForRole } = require("../utils/buildPermissions");

module.exports = (teamId) => [
	{
		clerkUserId: "seed-manager-dealflow360",
		email: "manager@dealflow360.example",
		name: "Neha Kapoor",
		role: "SALES_MANAGER",
		teamId,
		permissions: buildPermissionsForRole("SALES_MANAGER"),
	},
	{
		clerkUserId: "seed-sales-rep-001",
		email: "arjun@dealflow360.example",
		name: "Arjun Rao",
		role: "SALES_REP",
		teamId,
		permissions: buildPermissionsForRole("SALES_REP"),
	},
	{
		clerkUserId: "seed-sales-rep-002",
		email: "diya@dealflow360.example",
		name: "Diya Menon",
		role: "SALES_REP",
		teamId,
		permissions: buildPermissionsForRole("SALES_REP"),
	},
];