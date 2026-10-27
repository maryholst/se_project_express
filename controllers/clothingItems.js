const ClothingItems = require("../models/clothingItems");

module.exports.getClothingitems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send(items))
    .catch((err) =>
      res.status(500).send({ message: "An error has occurred on the server" })
    );
};

module.exports.createClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItems.create({
    name,
    weather,
    imageUrl,
    owner: req.user ? req.user._id : "anonymous",
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      res.status(400).send({ message: "Bad request" });
    });
};

module.exports.deleteClothingItems = (req, res) => {
  ClothingItems.findByIdAndDelete(req.params.itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch(() => res.status(400).send({ message: "Invalid item ID" }));
};
