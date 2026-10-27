const router = require("express").Router();
const users = require("../controllers/users");

router.get("/", users.getUsers);
router.get("/:userId", users.getUser);
router.post("/", users.createUser);

module.exports = router;