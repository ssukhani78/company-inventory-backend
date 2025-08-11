const express = require("express");
const router = express.Router();

// Import controller and validation middleware
const ItemController = require("../controllers/itemController");
const {
  validateCreateItem,
  validateUpdateItem,
  validateItemId,
} = require("../middlewares/validate");

// POST /item - Create a new item
router.post("/", validateCreateItem, ItemController.createItem);

// GET /item - Get all items
router.get("/", ItemController.getAllItems);

// GET /item/:id - Get item by ID
router.get(
  "/:id",
  // validateItemId,
  ItemController.getItemById
);

// PUT /item/:id - Update item
router.put(
  "/:id",
  // validateItemId,
  validateUpdateItem,
  ItemController.updateItem
);

// DELETE /item/:id - Delete item
router.delete("/:id", ItemController.deleteItem);

module.exports = router;
