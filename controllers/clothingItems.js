const clothingItems = require("../models/clothingItems");
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
        send({ message: "Invalid Item Data" });
      }
      return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "Sorry, there was an error with the server" });
    });
};

module.exports.deleteClothingItems = (req, res) => {
  clothingItems
    .findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Sorry, there was an error with the server" });
    });
};

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
};

module.exports.likeClothingItems = (req, res) =>
  ClothingItem.findByIdAndUpdate(
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
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Sorry, there was an error with the server" });
    });

module.exports.deleteLikeClothingItems = (req, res) =>
  ClothingItem.findByIdAndUpdate(
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
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: " Sorry, there was an error with the server" });
    });
