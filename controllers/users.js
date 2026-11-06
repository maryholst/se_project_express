const User = require("../models/users");
const mongoose = require("mongoose");
const validator = require("validator");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" })
    );
};

module.exports.getUser = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
  }

  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (
    !name ||
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 30 ||
    !avatar ||
    !validator.isURL(avatar)
  ) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
  }

  User.create({
    name,
    avatar
  })
  .then((user) => res.status(201).send(user))
  .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user data" });
        }
        return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Sorry, there was an error with the server" });
      });
};
