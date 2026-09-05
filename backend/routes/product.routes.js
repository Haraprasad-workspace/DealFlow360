const router = require("express").Router();
const controller = require("../controllers/product.controller");
const clerkAuth = require("../middleware/clerkAuth");
const syncUser = require("../middleware/syncUser");
const { authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const productValidator = require("../validators/product.validator");
const salesRepAuth = require("../middleware/salesRepAuth");

router.get("/category/:category", ...salesRepAuth, controller.getProductsByCategory);
router.get("/:productId", ...salesRepAuth, validate(productValidator.productId), controller.getProductById);
router.get("/", ...salesRepAuth, validate(productValidator.listProducts), controller.getProducts);
const salesAccess = [clerkAuth, syncUser, authorize("SALES_REP", "ADMIN")];

router.get("/category/:category", ...salesAccess, controller.getProductsByCategory);
router.get("/:productId", ...salesAccess, validate(productValidator.productId), controller.getProductById);
router.get("/", ...salesAccess, validate(productValidator.listProducts), controller.getProducts);

module.exports = router;
