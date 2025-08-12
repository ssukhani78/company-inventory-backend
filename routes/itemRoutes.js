const express = require("express");
const router = express.Router();

// Import controller and validation middleware
const ItemController = require("../controllers/itemController");
const {
  validateCreateItem,
  validateUpdateItem,
} = require("../middlewares/validate");
const { authenticateToken } = require("../middlewares/auth");

// POST /item - Create a new item
router.post(
  "/",
  authenticateToken,
  validateCreateItem,
  ItemController.createItem
);

// GET /item - Get all items
router.get("/", authenticateToken, ItemController.getAllItems);

// GET /item/:id - Get item by ID
router.get("/:id", authenticateToken, ItemController.getItemById);

// PUT /item/:id - Update item
router.put(
  "/:id",
  authenticateToken,
  validateUpdateItem,
  ItemController.updateItem
);

// DELETE /item/:id - Delete item
router.delete("/:id", authenticateToken, ItemController.deleteItem);

module.exports = router;
