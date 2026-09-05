export const USER_ROLES = {
	SALES_REP: "SALES_REP",
	SALES_MANAGER: "SALES_MANAGER",
	FINANCE: "FINANCE",
	ADMIN: "ADMIN",
	CUSTOMER: "CUSTOMER",
};

export const INTERNAL_ROLES = [
	USER_ROLES.SALES_REP,
	USER_ROLES.SALES_MANAGER,
	USER_ROLES.FINANCE,
	USER_ROLES.ADMIN,
];

export const ROLE_OPTIONS = [
	{ label: "Sales Rep", value: USER_ROLES.SALES_REP },
	{ label: "Sales Manager", value: USER_ROLES.SALES_MANAGER },
	{ label: "Finance / Operations", value: USER_ROLES.FINANCE },
	{ label: "Admin", value: USER_ROLES.ADMIN },
	{ label: "Customer", value: USER_ROLES.CUSTOMER },
];

export const getHomeRouteForRole = (role) =>
	role === USER_ROLES.CUSTOMER ? "/portal" : "/dashboard";
