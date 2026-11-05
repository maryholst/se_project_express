const router = require("express").Router();
const ClothingItems = require("../controllers/clothingItems");

router.get("/", ClothingItems.getClothingItems);
router.post("/", ClothingItems.createClothingItems);
router.delete("/:itemId", ClothingItems.deleteClothingItems);
router.put("/:itemId/likes", ClothingItems.likeClothingItems);
router.delete("/:itemId/likes", ClothingItems.deleteLikeClothingItems);

module.exports = router;