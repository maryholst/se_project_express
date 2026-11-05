const User = require("../models/users");
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" })
    );
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" })
    );
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

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
