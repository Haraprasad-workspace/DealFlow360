const router = require("express").Router();
const clerkAuth = require("../middleware/clerkAuth");
const syncUser = require("../middleware/syncUser");
const requireRole = require("../middleware/requireRole");
const { USER_ROLES } = require("../constants/userRoles");
const validate = require("../middlewares/validate");
const managerValidator = require("../validators/manager.validator");
const controller = require("../controllers/managerQuotation.controller");

const managerAccess = [clerkAuth, syncUser, requireRole([USER_ROLES.SALES_MANAGER, USER_ROLES.ADMIN])];

router.get("/", ...managerAccess, validate(managerValidator.quotationList), controller.getQuotations);
router.get("/stats", ...managerAccess, controller.getQuotationStats);
router.get("/:quotationId", ...managerAccess, validate(managerValidator.quotationId), controller.getQuotationById);

module.exports = router;