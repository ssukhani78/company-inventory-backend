const Item = require("../models/Item");

/**
 * Item Controller
 * Contains all business logic for item operations
 */
class ItemController {
  /**
   * Create a new item
   */
  static async createItem(req, res) {
    try {
      const itemData = req.body;

      const existingItem = await Item.getByHsnCode(itemData.hsnCode);

      if (existingItem.length > 0) {
        return res.status(400).json({
          success: false,
          message: "An item with this HSN code already exists",
        });
      }

      const newItem = await Item.create(itemData);

      res.status(201).json({
        success: true,
        message: "Item created successfully",
        data: newItem,
      });
    } catch (error) {
      console.error("Error creating item:", error);

      // Handle duplicate SKU error
      if (error.code === "ER_DUP_ENTRY" && error.message.includes("sku")) {
        return res.status(400).json({
          success: false,
          message: "An item with this SKU already exists",
        });
      }

      // Handle foreign key constraint error (invalid companyId)
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID provided",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Get all items
   */
  static async getAllItems(req, res) {
    try {
      const items = await Item.getAll();

      res.status(200).json({
        success: true,
        count: items.length,
        data: items,
      });
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Get item by ID
   */
  static async getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.getById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Get items by company ID
   */
  static async getItemsByCompany(req, res) {
    try {
      const { companyId } = req.params;
      const items = await Item.getByCompanyId(companyId);

      res.status(200).json({
        success: true,
        count: items.length,
        data: items,
      });
    } catch (error) {
      console.error("Error fetching items by company:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Update item by ID
   */
  static async updateItem(req, res) {
    try {
      const { id } = req.params;
      const itemData = req.body;

      // Check if item exists
      const existingItem = await Item.getById(id);
      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      // Update the item
      const result = await Item.update(id, itemData);

      // If no rows were affected, the item might have been deleted
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Item not found or no changes made",
        });
      }

      // Fetch updated item data
      const updatedItem = await Item.getById(id);

      res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: updatedItem,
      });
    } catch (error) {
      console.error("Error updating item:", error);

      // Handle duplicate SKU error
      if (error.code === "ER_DUP_ENTRY" && error.message.includes("sku")) {
        return res.status(400).json({
          success: false,
          message: "An item with this SKU already exists",
        });
      }

      // Handle foreign key constraint error (invalid companyId)
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID provided",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Delete item by ID
   */
  static async deleteItem(req, res) {
    try {
      const { id } = req.params;

      // Check if item exists
      const existingItem = await Item.getById(id);
      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      // Delete the item (soft delete)
      const result = await Item.delete(id);

      // If no rows were affected, the item might have been already deleted
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Item deleted successfully",
        data: {
          id: id,
          deletedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error deleting item:", error);

      // Handle foreign key constraint errors
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          success: false,
          message:
            "Cannot delete item as it has associated records (sales, orders, etc.)",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Get item statistics
   */
  static async getItemStats(req, res) {
    try {
      const stats = await Item.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error fetching item statistics:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Bulk operations for items
   */
  static async bulkDeleteItems(req, res) {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide an array of item IDs",
        });
      }

      const result = await Item.bulkDelete(ids);

      res.status(200).json({
        success: true,
        message: `${result.deletedCount} items deleted successfully`,
        data: {
          deletedCount: result.deletedCount,
          failedIds: result.failedIds,
        },
      });
    } catch (error) {
      console.error("Error in bulk delete:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }
}

module.exports = ItemController;
