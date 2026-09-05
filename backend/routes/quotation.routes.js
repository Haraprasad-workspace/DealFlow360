const router = require("express").Router();
const controller = require("../controllers/quotation.controller");
const clerkAuth = require("../middleware/clerkAuth");
const syncUser = require("../middleware/syncUser");
const { authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const quotationValidator = require("../validators/quotation.validator");

const salesAccess = [clerkAuth, syncUser, authorize("SALES_REP", "ADMIN")];

router.post("/", ...salesAccess, validate(quotationValidator.createQuotation), controller.createQuotation);
router.get("/", ...salesAccess, validate(quotationValidator.listQuotations), controller.getQuotations);
router.get("/:quotationId/recommendations", ...salesAccess, controller.getRecommendations);
router.post("/:quotationId/items", ...salesAccess, validate(quotationValidator.addItem), controller.addQuotationItem);
router.put("/:quotationId/items/:itemId", ...salesAccess, validate(quotationValidator.updateItem), controller.updateQuotationItem);
router.delete("/:quotationId/items/:itemId", ...salesAccess, validate(quotationValidator.itemParams), controller.removeQuotationItem);
router.post("/:quotationId/submit", ...salesAccess, validate(quotationValidator.quotationId), controller.submitQuotation);
router.post("/:quotationId/cancel", ...salesAccess, validate(quotationValidator.quotationId), controller.cancelQuotation);
router.get("/:quotationId", ...salesAccess, validate(quotationValidator.quotationId), controller.getQuotationById);
router.put("/:quotationId", ...salesAccess, validate(quotationValidator.updateQuotation), controller.updateQuotation);
router.delete("/:quotationId", ...salesAccess, validate(quotationValidator.quotationId), controller.cancelQuotation);

module.exports = router;
