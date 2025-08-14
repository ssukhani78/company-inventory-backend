const express = require("express");
const router = express.Router();

// Import controller and validation middleware
const SalesController = require("../controllers/salesController");
const {
  validateCreateSale,
  validateUpdateSale,
  validateSaleId,
} = require("../middlewares/validate");
const { authenticateToken } = require("../middlewares/auth");

/**
 * Sales Routes
 * Clean routes that only define endpoints and call controllers
 */

// POST /api/sales - Create a new sale
router.post(
  "/",
  authenticateToken,
  validateCreateSale,
  SalesController.createSale
);

// GET /api/sales - Get all sales
router.get("/", authenticateToken, SalesController.getAllSales);

// GET /api/sales/:id - Get sale by ID
router.get(
  "/:id",
  authenticateToken,
  validateSaleId,
  SalesController.getSaleById
);

// PUT /api/sales/:id - Update sale
router.put(
  "/:id",
  authenticateToken,
  validateSaleId,
  validateUpdateSale,
  SalesController.updateSale
);

// DELETE /api/sales/:id - Delete sale
router.delete(
  "/:id",
  authenticateToken,
  validateSaleId,
  SalesController.deleteSale
);

module.exports = router;
