const router = require("express").Router();
const controller = require("../../controllers/adminConfig.controller");
const clerkAuth = require("../../middleware/clerkAuth");
const syncUser = require("../../middleware/syncUser");
const { authorize } = require("../../middlewares/auth.middleware");
const configurePermission = require("../../middlewares/configurePermission");
const validate = require("../../middlewares/validate");
const schemas = require("../../validators/adminConfig.validator");

const auth = [clerkAuth, syncUser, authorize("ADMIN", "SALES_MANAGER")];
const resources = { products: "products", discountTiers: "discountTiers", warehouses: "warehouses", subscriptionPlans: "subscriptionPlans" };

Object.entries(resources).forEach(([resource, scope]) => {
	const resourceRouter = require("express").Router();
	const resourceAuth = [...auth, configurePermission(scope)];
	resourceRouter.get("/", ...resourceAuth, validate(schemas.list), controller.list);
	resourceRouter.get("/:id", ...resourceAuth, validate(schemas.id), controller.get);
	resourceRouter.post("/", ...resourceAuth, validate(schemas.create[resource]), controller.create);
	resourceRouter.put("/:id", ...resourceAuth, validate(schemas.update[resource]), controller.update);
	resourceRouter.delete("/:id", ...resourceAuth, validate(schemas.id), controller.remove);
	router.use(`/${resource}`, resourceRouter);
});

module.exports = router;
