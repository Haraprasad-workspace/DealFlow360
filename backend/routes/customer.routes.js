const router = require("express").Router();
const controller = require("../controllers/customer.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const customerValidator = require("../validators/customer.validator");

router.post("/", authenticate, authorize("SALES_REP", "ADMIN"), validate(customerValidator.createCustomer), controller.createCustomer);
router.get("/", authenticate, authorize("SALES_REP", "ADMIN"), validate(customerValidator.listCustomers), controller.getCustomers);
router.get("/:customerId", authenticate, authorize("SALES_REP", "ADMIN"), validate(customerValidator.customerId), controller.getCustomerById);
router.put("/:customerId", authenticate, authorize("SALES_REP", "ADMIN"), validate(customerValidator.updateCustomer), controller.updateCustomer);
router.delete("/:customerId", authenticate, authorize("SALES_REP", "ADMIN"), validate(customerValidator.customerId), controller.deleteCustomer);

module.exports = router;
