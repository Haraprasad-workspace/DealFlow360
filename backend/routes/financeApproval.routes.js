const router = require("express").Router();
const clerkAuth = require("../middleware/clerkAuth");
const syncUser = require("../middleware/syncUser");
const requireRole = require("../middleware/requireRole");
const { USER_ROLES } = require("../constants/userRoles");
const validate = require("../middlewares/validate");
const managerValidator = require("../validators/manager.validator");
const controller = require("../controllers/financeApproval.controller");

const financeAccess = [clerkAuth, syncUser, requireRole([USER_ROLES.FINANCE, USER_ROLES.ADMIN])];

router.get("/", ...financeAccess, controller.getPending);
router.post("/:quotationId/approve", ...financeAccess, validate(managerValidator.quotationId), controller.approve);
router.post("/:quotationId/reject", ...financeAccess, validate(managerValidator.rejection), controller.reject);

module.exports = router;
