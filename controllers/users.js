const User = require("../models/users");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) =>
      res.status(500).send({ message: "An error has occurred on the server" })
    );
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) =>
      res.status(500).send({ message: "An error has occurred on the server" })
    );
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({
    name,
    avatar
  })
  .then((user) => res.status(201).send(user))
  .catch((err) => res.status(400).send({ message: "Bad request" }));
};
