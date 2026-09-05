const router = require("express").Router();
const controller = require("../controllers/customer.controller");
const validate = require("../middlewares/validate");
const customerValidator = require("../validators/customer.validator");
const salesRepAuth = require("../middleware/salesRepAuth");

// Authentication runs before validation and controller logic.
router.post("/", ...salesRepAuth, validate(customerValidator.createCustomer), controller.createCustomer);
router.get("/", ...salesRepAuth, validate(customerValidator.listCustomers), controller.getCustomers);
router.get("/:customerId", ...salesRepAuth, validate(customerValidator.customerId), controller.getCustomerById);
router.put("/:customerId", ...salesRepAuth, validate(customerValidator.updateCustomer), controller.updateCustomer);
router.delete("/:customerId", ...salesRepAuth, validate(customerValidator.customerId), controller.deleteCustomer);

module.exports = router;
