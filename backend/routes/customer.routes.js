const router = require("express").Router();
const controller = require("../controllers/customer.controller");
const clerkAuth = require("../middleware/clerkAuth");
const syncUser = require("../middleware/syncUser");
const { authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const customerValidator = require("../validators/customer.validator");

const salesAccess = [clerkAuth, syncUser, authorize("SALES_REP", "ADMIN")];

router.post("/", ...salesAccess, validate(customerValidator.createCustomer), controller.createCustomer);
router.get("/", ...salesAccess, validate(customerValidator.listCustomers), controller.getCustomers);
router.get("/:customerId", ...salesAccess, validate(customerValidator.customerId), controller.getCustomerById);
router.put("/:customerId", ...salesAccess, validate(customerValidator.updateCustomer), controller.updateCustomer);
router.delete("/:customerId", ...salesAccess, validate(customerValidator.customerId), controller.deleteCustomer);

module.exports = router;
