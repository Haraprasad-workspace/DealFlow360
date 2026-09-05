const router = require("express").Router();
const clerkAuth = require("../middleware/clerkAuth");
const syncUser = require("../middleware/syncUser");
const { getMe } = require("../controllers/me.controller");

router.get("/", clerkAuth, syncUser, getMe);

module.exports = router;
