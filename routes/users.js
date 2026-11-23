const router = require("express").Router();
const users = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, users.getCurrentUser);
router.patch("/me", auth, users.updateCurrentUser);

module.exports = router;