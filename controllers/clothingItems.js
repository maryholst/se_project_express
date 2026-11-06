const clothingItems = require("../models/clothingItems");
const mongoose = require("mongoose");
const validator = require("validator");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.send(items))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Sorry, there was an error with the server" });
    });
};

module.exports.createClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (
    !name ||
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 30 ||
    !["hot", "warm", "cold"].includes(weather) ||
    !imageUrl ||
    !validator.isURL(imageUrl)
  ) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item data" });
  }

  clothingItems
    .create({
      name,
      weather,
      imageUrl,
      owner: req.user ? Reflect.get(req.user, "_id") : "anonymous",
    })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
        .status(BAD_REQUEST).
        send({ message: "Invalid item data" });
      }
      return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "Sorry, there was an error with the server" });
    });
};

module.exports.deleteClothingItems = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }

  clothingItems
    .findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Sorry, there was an error with the server" });
    });
};

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
};

module.exports.likeClothingItems = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }
  if (!req.user || !mongoose.isValidObjectId(req.user._id)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
  }

  return clothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Sorry, there was an error with the server" });
    });
};

module.exports.deleteLikeClothingItems = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }
  if (!req.user || !mongoose.isValidObjectId(req.user._id)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
  }

  return clothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: " Sorry, there was an error with the server" });
    });
};
