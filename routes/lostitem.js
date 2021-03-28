var express = require("express");
const LostItemController = require("../controllers/LostItemController");

var router = express.Router();

//router.get("/", LostItemController.lostItemList);
router.get("/:id", LostItemController.lostItemList);
router.post("/", LostItemController.lostItemStore);
router.put("/:id", LostItemController.lostItemUpdate);
router.delete("/:id", LostItemController.lostItemDelete);

module.exports = router;