const express = require("express");
const clothingItems = require("./clothingItems");
const users = require("./users");
const userController = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

const router = express.Router();

router.post("/signin", userController.login);
router.post("/signup", userController.createUser);
router.use("/users", users);
router.use("/items", clothingItems);

router.use("/", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;