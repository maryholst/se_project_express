const router = require("express").Router();
const ClothingItems = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.get("/", ClothingItems.getClothingItems);
router.post("/", auth, ClothingItems.createClothingItems);
router.delete("/:itemId", auth, ClothingItems.deleteClothingItems);
router.put("/:itemId/likes", auth, ClothingItems.likeClothingItems);
router.delete("/:itemId/likes", auth, ClothingItems.deleteLikeClothingItems);

module.exports = router;