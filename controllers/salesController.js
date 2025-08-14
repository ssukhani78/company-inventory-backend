const Sales = require("../models/sales");

/**
 * Sales Controller
 * Contains all business logic for sales operations
 */
class SalesController {
  /**
   * Create a new sale
   */
  static async createSale(req, res) {
    try {
      const salesData = req.body;

      const newSale = await Sales.create(salesData);

      res.status(201).json({
        success: true,
        message: "Sale created successfully",
        data: newSale,
      });
    } catch (error) {
      console.error("Error creating sale:", error);

      // Handle foreign key constraint errors
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        if (error.message.includes("companyId")) {
          return res.status(400).json({
            success: false,
            message: "Company not found with the provided ID",
          });
        }
        if (error.message.includes("itemId")) {
          return res.status(400).json({
            success: false,
            message: "Item not found with the provided ID",
          });
        }
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
   * Get all sales with optional filtering
   */
  static async getAllSales(req, res) {
    try {
      const sales = await Sales.getAll();

      res.status(200).json({
        success: true,
        count: sales.length,
        data: sales,
      });
    } catch (error) {
      console.error("Error fetching sales:", error);
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
   * Get sale by ID
   */
  static async getSaleById(req, res) {
    try {
      const { id } = req.params;
      const sale = await Sales.getById(id);

      if (!sale) {
        return res.status(404).json({
          success: false,
          message: "Sale not found",
        });
      }

      res.status(200).json({
        success: true,
        data: sale,
      });
    } catch (error) {
      console.error("Error fetching sale:", error);
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
   * Update sale by ID
   */
  static async updateSale(req, res) {
    try {
      const { id } = req.params;
      const salesData = req.body;

      // Check if sale exists
      const existingSale = await Sales.getById(id);
      if (!existingSale) {
        return res.status(404).json({
          success: false,
          message: "Sale not found",
        });
      }

      // Update the sale
      const result = await Sales.update(id, salesData);

      // If no rows were affected, the sale might have been deleted
      if (result.affectedRows === 0) {
        return res.status(200).json({
          success: true,
          message: "No changes made",
        });
      }

      // Fetch updated sale data
      const updatedSale = await Sales.getById(id);

      res.status(200).json({
        success: true,
        message: "Sale updated successfully",
        data: updatedSale,
      });
    } catch (error) {
      console.error("Error updating sale:", error);

      // Handle foreign key constraint errors
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        if (error.message.includes("companyId")) {
          return res.status(400).json({
            success: false,
            message: "Company not found with the provided ID",
          });
        }
        if (error.message.includes("itemId")) {
          return res.status(400).json({
            success: false,
            message: "Item not found with the provided ID",
          });
        }
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
   * Delete sale by ID
   */
  static async deleteSale(req, res) {
    try {
      const { id } = req.params;

      // Check if sale exists
      const existingSale = await Sales.getById(id);
      if (!existingSale) {
        return res.status(404).json({
          success: false,
          message: "Sale not found",
        });
      }

      // Delete the sale
      const result = await Sales.delete(id);

      // If no rows were affected, the sale might have been already deleted
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Sale not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Sale deleted successfully",
        data: {
          id: id,
          deletedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error deleting sale:", error);

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
   * Get sales by company ID
   */
//   static async getSalesByCompany(req, res) {
//     try {
//       const { companyId } = req.params;
//       const sales = await Sales.getByCompanyId(companyId);

//       res.status(200).json({
//         success: true,
//         count: sales.length,
//         data: sales,
//       });
//     } catch (error) {
//       console.error("Error fetching sales by company:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error:
//           process.env.NODE_ENV === "development"
//             ? error.message
//             : "Something went wrong",
//       });
//     }
//   }

//   /**
//    * Get sales by item ID
//    */
//   static async getSalesByItem(req, res) {
//     try {
//       const { itemId } = req.params;
//       const sales = await Sales.getByItemId(itemId);

//       res.status(200).json({
//         success: true,
//         count: sales.length,
//         data: sales,
//       });
//     } catch (error) {
//       console.error("Error fetching sales by item:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error:
//           process.env.NODE_ENV === "development"
//             ? error.message
//             : "Something went wrong",
//       });
//     }
//   }
}

module.exports = SalesController;
