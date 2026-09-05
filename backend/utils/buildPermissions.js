const { USER_ROLES } = require("../constants/userRoles");

const CONFIGURE_SCOPES = {
	discountTiers: "discountTiers",
	approvalChains: "approvalChains",
	products: "products",
	warehouses: "warehouses",
	subscriptionPlans: "subscriptionPlans",
};

const ROLE_PERMISSIONS = {
	[USER_ROLES.SALES_REP]: {
		canApprove: { discountUpTo: null },
		canConfigure: [],
	},
	[USER_ROLES.SALES_MANAGER]: {
		canApprove: { discountUpTo: 15 },
		canConfigure: [
			CONFIGURE_SCOPES.discountTiers,
			CONFIGURE_SCOPES.approvalChains,
		],
	},
	[USER_ROLES.FINANCE]: {
		canApprove: { discountUpTo: 100 },
		canConfigure: [],
	},
	[USER_ROLES.ADMIN]: {
		canApprove: { discountUpTo: 100 },
		canConfigure: [
			CONFIGURE_SCOPES.discountTiers,
			CONFIGURE_SCOPES.approvalChains,
			CONFIGURE_SCOPES.products,
			CONFIGURE_SCOPES.warehouses,
			CONFIGURE_SCOPES.subscriptionPlans,
		],
	},
	[USER_ROLES.CUSTOMER]: {
		canApprove: { discountUpTo: null },
		canConfigure: [],
	},
};

const buildPermissionsForRole = (role) => {
	const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[USER_ROLES.SALES_REP];

	return {
		canApprove: { ...permissions.canApprove },
		canConfigure: [...permissions.canConfigure],
	};
};

module.exports = {
	CONFIGURE_SCOPES,
	ROLE_PERMISSIONS,
	buildPermissionsForRole,
};
