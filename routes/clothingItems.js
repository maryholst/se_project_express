const router = require("express").Router();
const ClothingItems = require("../controllers/clothingItems");

router.get("/", ClothingItems.getClothingItems);
router.post("/", ClothingItems.createClothingItems);
router.delete("/:itemId", ClothingItems.deleteClothingItems);

module.exports = router;