const express = require("express");
const clothingItems = require("./clothingItems");
const users = require("./users");
const { NOT_FOUND } = require("../utils/errors");

const router = express.Router();

router.use("/users", users);
router.use("/items", clothingItems);

router.use("/", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;