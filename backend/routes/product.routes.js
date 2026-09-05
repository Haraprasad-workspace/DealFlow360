const router = require("express").Router();
const controller = require("../controllers/product.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const productValidator = require("../validators/product.validator");

router.get("/category/:category", authenticate, authorize("SALES_REP", "ADMIN"), controller.getProductsByCategory);
router.get("/:productId", authenticate, authorize("SALES_REP", "ADMIN"), validate(productValidator.productId), controller.getProductById);
router.get("/", authenticate, authorize("SALES_REP", "ADMIN"), validate(productValidator.listProducts), controller.getProducts);

module.exports = router;
