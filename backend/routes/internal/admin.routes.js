const router = require("express").Router();
const controller = require("../../controllers/adminConfig.controller");
const clerkAuth = require("../../middleware/clerkAuth");
const syncUser = require("../../middleware/syncUser");
const requireRole = require("../../middleware/requireRole");
const { USER_ROLES } = require("../../constants/userRoles");
const configurePermission = require("../../middlewares/configurePermission");
const validate = require("../../middlewares/validate");
const schemas = require("../../validators/adminConfig.validator");

const auth = [clerkAuth, syncUser, requireRole([USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER])];
const resources = { products: "products", discountTiers: "discountTiers", categoryDiscounts: "discountTiers", warehouses: "warehouses", subscriptionPlans: "subscriptionPlans" };
const discountAuth = [...auth, configurePermission("approvalChains")];

router.get("/approval-config", ...discountAuth, validate(schemas.approvalConfig), controller.getApprovalConfig);
router.post("/approval-config", ...discountAuth, validate(schemas.approvalConfig), controller.saveApprovalConfig);

Object.entries(resources).forEach(([resource, scope]) => {
	const resourceRouter = require("express").Router();
	const resourceAuth = [...auth, configurePermission(scope)];
	const setResource = (req, _res, next) => {
		req.params.resource = resource;
		next();
	};
	resourceRouter.get("/", ...resourceAuth, setResource, validate(schemas.list), controller.list);
	resourceRouter.get("/:id", ...resourceAuth, setResource, validate(schemas.id), controller.get);
	resourceRouter.post("/", ...resourceAuth, setResource, validate(schemas.create[resource]), controller.create);
	resourceRouter.put("/:id", ...resourceAuth, setResource, validate(schemas.update[resource]), controller.update);
	resourceRouter.delete("/:id", ...resourceAuth, setResource, validate(schemas.id), controller.remove);
	router.use(`/${resource}`, resourceRouter);
});

module.exports = router;
