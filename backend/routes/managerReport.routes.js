const router = require("express").Router();
const clerkAuth = require("../middleware/clerkAuth");
const syncUser = require("../middleware/syncUser");
const requireRole = require("../middleware/requireRole");
const { USER_ROLES } = require("../constants/userRoles");
const validate = require("../middlewares/validate");
const managerValidator = require("../validators/manager.validator");
const controller = require("../controllers/managerReport.controller");

const managerAccess = [clerkAuth, syncUser, requireRole([USER_ROLES.SALES_MANAGER, USER_ROLES.ADMIN])];

router.get("/sales", ...managerAccess, validate(managerValidator.reportQuery), controller.getSalesReport);
router.get("/team", ...managerAccess, validate(managerValidator.reportQuery), controller.getTeamReport);
router.get("/products", ...managerAccess, validate(managerValidator.reportQuery), controller.getProductReport);

module.exports = router;