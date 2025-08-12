const { pool } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Item {
  // Insert a new item
  static async create(itemData) {
    const { name, description, hsnCode,status } = itemData;

    description = description ? description : null; 

    const insertQuery = `
      INSERT INTO item 
      (id, name, description, hsnCode, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const id = uuidv4();

    const values = [id, name, description, hsnCode, status];

    try {
      const [result] = await pool.execute(insertQuery, values);
      return {
        id: id,
        ...itemData,
        message: "Item created successfully",
      };
    } catch (error) {
      console.error("❌ Error creating item:", error.message);
      throw error;
    }
  }
  // Get all items
  static async getAll() {
    const query = "SELECT * FROM item ORDER BY createdAt ASC";

    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching items:", error.message);
      throw error;
    }
  }

  // Get item by ID
  static async getById(id) {
    const query = "SELECT * FROM item WHERE id = ?";

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error("❌ Error fetching item:", error.message);
      throw error;
    }
  }

  // Get item by HSN code
  static async getByHsnCode(hsnCode) {
    const query = "SELECT * FROM item WHERE hsnCode = ?";

    try {
      const [rows] = await pool.execute(query, [hsnCode]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching item by HSN code:", error.message);
      throw error;
    }
  }

  // Update item
  static async update(id, itemData) {
    const updateQuery = `
      UPDATE item 
      SET name = ?, description = ?, hsnCode = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    itemData.description = itemData.description ? itemData.description : null;

    const values = [
      itemData.name,
      itemData.description,
      itemData.hsnCode,
      itemData.status,
      id,
    ];

    try {
      const [result] = await pool.execute(updateQuery, values);
      return {
        affectedRows: result.affectedRows,
        message: "Item updated successfully",
      };
    } catch (error) {
      console.error("❌ Error updating item:", error.message);
      throw error;
    }
  }

  // Delete item (hard delete)
  static async delete(id) {
    const query = "DELETE FROM item WHERE id = ?";

    try {
      const [result] = await pool.execute(query, [id]);
      return {
        affectedRows: result.affectedRows,
        message: "Item deleted successfully",
      };
    } catch (error) {
      console.error("❌ Error deleting item:", error.message);
      throw error;
    }
  }

  // Get item statistics
  static async getStats() {
    const statsQuery = `
      SELECT 
        COUNT(*) as totalItems,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as activeItems,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactiveItems,
      FROM item
    `;

    try {
      const [rows] = await pool.execute(statsQuery);
      return rows[0];
    } catch (error) {
      console.error("❌ Error fetching item statistics:", error.message);
      throw error;
    }
  }
}

module.exports = Item;
