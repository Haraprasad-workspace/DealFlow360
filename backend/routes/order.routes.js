const router = require("express").Router();
const controller = require("../controllers/order.controller");
const validate = require("../middlewares/validate");
const orderValidator = require("../validators/order.validator");
const salesRepAuth = require("../middleware/salesRepAuth");

const salesAccess = salesRepAuth;

router.post("/from-quotation/:quotationId", ...salesAccess, validate(orderValidator.createOrder), controller.createOrderFromQuotation);
router.get("/", ...salesAccess, validate(orderValidator.listOrders), controller.getOrders);
router.get("/:orderId", ...salesAccess, validate(orderValidator.orderId), controller.getOrderById);
router.post("/:orderId/cancel", ...salesAccess, validate(orderValidator.orderId), controller.cancelOrder);

module.exports = router;
