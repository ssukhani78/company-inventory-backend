const { pool } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Sales {
  // Insert a new sale
  static async create(salesData) {
    const { companyId, itemId, unit } = salesData;

    const insertQuery = `
      INSERT INTO sales 
      (id, companyId, itemId, unit)
      VALUES (?, ?, ?, ?)
    `;

    const id = uuidv4();

    const values = [id, companyId, itemId, unit];

    try {
      const [result] = await pool.execute(insertQuery, values);
      return {
        id: id,
        ...salesData,
        message: "Sale created successfully",
      };
    } catch (error) {
      console.error("❌ Error creating sale:", error.message);
      throw error;
    }
  }

  // Get all sales
  static async getAll() {
    const query = `
      SELECT 
        s.*,
        c.name as companyName,
        c.gstNo as companyGstNo,
        i.name as itemName,
        i.hsnCode as itemHsnCode
      FROM sales s
      LEFT JOIN company c ON s.companyId = c.id
      LEFT JOIN item i ON s.itemId = i.id
      ORDER BY s.createdAt DESC
    `;

    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching sales:", error.message);
      throw error;
    }
  }

  // Get sale by ID
  static async getById(id) {
    const query = `
      SELECT 
        s.*,
        c.name as companyName,
        c.gstNo as companyGstNo,
        i.name as itemName,
        i.hsnCode as itemHsnCode
      FROM sales s
      LEFT JOIN company c ON s.companyId = c.id
      LEFT JOIN item i ON s.itemId = i.id
      WHERE s.id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error("❌ Error fetching sale:", error.message);
      throw error;
    }
  }

  // Update sale
  static async update(id, salesData) {
    const updateQuery = `
      UPDATE sales 
      SET companyId = ?, itemId = ?, unit = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const values = [salesData.companyId, salesData.itemId, salesData.unit, id];

    try {
      const [result] = await pool.execute(updateQuery, values);
      return {
        affectedRows: result.affectedRows,
        message: "Sale updated successfully",
      };
    } catch (error) {
      console.error("❌ Error updating sale:", error.message);
      throw error;
    }
  }

  // Delete sale (hard delete)
  static async delete(id) {
    const query = "DELETE FROM sales WHERE id = ?";

    try {
      const [result] = await pool.execute(query, [id]);
      return {
        affectedRows: result.affectedRows,
        message: "Sale deleted successfully",
      };
    } catch (error) {
      console.error("❌ Error deleting sale:", error.message);
      throw error;
    }
  }

  // Get sales by company ID
  static async getByCompanyId(companyId) {
    const query = `
      SELECT 
        s.*,
        c.name as companyName,
        c.gstNo as companyGstNo,
        i.name as itemName,
        i.hsnCode as itemHsnCode
      FROM sales s
      LEFT JOIN company c ON s.companyId = c.id
      LEFT JOIN item i ON s.itemId = i.id
      WHERE s.companyId = ?
      ORDER BY s.createdAt DESC
    `;

    try {
      const [rows] = await pool.execute(query, [companyId]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching sales by company:", error.message);
      throw error;
    }
  }

  // Get sales by item ID
  static async getByItemId(itemId) {
    const query = `
      SELECT 
        s.*,
        c.name as companyName,
        c.gstNo as companyGstNo,
        i.name as itemName,
        i.hsnCode as itemHsnCode
      FROM sales s
      LEFT JOIN company c ON s.companyId = c.id
      LEFT JOIN item i ON s.itemId = i.id
      WHERE s.itemId = ?
      ORDER BY s.createdAt DESC
    `;

    try {
      const [rows] = await pool.execute(query, [itemId]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching sales by item:", error.message);
      throw error;
    }
  }
}

module.exports = Sales;
