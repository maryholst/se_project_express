const router = require("express").Router();
const users = require("../controllers/users");

router.get("/", users.getUsers);
router.get("/me", users.getCurrentUser);
router.patch("/me", users.updateCurrentUser);

module.exports = router;