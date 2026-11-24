const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const {
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  MONGO_DUPLICATE_KEY
} = require("../utils/errors");

module.exports.getCurrentUser = (req, res) =>
  User.findById(req.user._id)
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
        .send({ message: "An error has occurred on the server." });
    });

module.exports.updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body || {};
  const update = {};

  if (name !== undefined) {
    update.name = name;
  }
  if (avatar !== undefined) {
    update.avatar = avatar;
  }
  if (Object.keys(update).length === 0) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
  }

  return User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body || {};

  if (
    !name ||
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 30 ||
    !avatar ||
    typeof avatar !== "string" ||
    !validator.isURL(avatar) ||
    !email ||
    typeof email !== "string" ||
    !validator.isEmail(email) ||
    !password ||
    typeof password !== "string"
  ) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userData = user.toObject();
    delete userData.password;
    return res.status(CREATED).send(userData);
  } catch (err) {
    console.error(err);
    if (err.code === MONGO_DUPLICATE_KEY) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    !validator.isEmail(email) ||
    typeof password !== "string" ||
    !password
  ) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Invalid email or password" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not configured");
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.statusCode === UNAUTHORIZED) {
        return res.status(UNAUTHORIZED).send({ message: "Invalid email or password" });
      }
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};
