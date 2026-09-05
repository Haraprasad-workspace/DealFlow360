const router = require("express").Router();
const clerkAuth = require("../../middleware/clerkAuth");
const syncUser = require("../../middleware/syncUser");
const requireRole = require("../../middleware/requireRole");
const validate = require("../../middlewares/validate");
const quotationController = require("../../controllers/portal/quotation.controller");
const orderController = require("../../controllers/portal/order.controller");
const quotationValidator = require("../../validators/portal/quotation.validator");
const orderValidator = require("../../validators/portal/order.validator");

const customerAccess = [clerkAuth, syncUser, requireRole(["CUSTOMER"])];

router.get("/quotations", ...customerAccess, validate(quotationValidator.list), quotationController.list);
router.get("/quotations/:quotationId", ...customerAccess, validate(quotationValidator.detail), quotationController.detail);
router.get("/orders", ...customerAccess, validate(orderValidator.list), orderController.list);
router.get("/orders/:orderId", ...customerAccess, validate(orderValidator.detail), orderController.detail);

module.exports = router;
