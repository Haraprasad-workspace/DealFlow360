const router = require("express").Router();
const controller = require("../controllers/product.controller");
const validate = require("../middlewares/validate");
const productValidator = require("../validators/product.validator");
const salesRepAuth = require("../middleware/salesRepAuth");

router.get("/category/:category", ...salesRepAuth, controller.getProductsByCategory);
router.get("/:productId", ...salesRepAuth, validate(productValidator.productId), controller.getProductById);
router.get("/", ...salesRepAuth, validate(productValidator.listProducts), controller.getProducts);

module.exports = router;
