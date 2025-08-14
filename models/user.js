const { pool } = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

class User {
  // Create a new user
  static async create(userData) {
    const { name, email, password } = userData;

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
      INSERT INTO user 
      (id, name, email, password)
      VALUES (?, ?, ?, ?)
    `;

    const id = uuidv4();

    const values = [id, name, email, hashedPassword];

    try {
      const [result] = await pool.execute(insertQuery, values);
      return {
        id: id,
        name,
        email,
        message: "User created successfully",
      };
    } catch (error) {
      console.error("❌ Error creating user:", error.message);
      throw error;
    }
  }

  // Get all users
  // static async getAll() {
  //   const query = "SELECT id, name, email FROM user ORDER BY name ASC";

  //   try {
  //     const [rows] = await pool.execute(query);
  //     return rows;
  //   } catch (error) {
  //     console.error("❌ Error fetching users:", error.message);
  //     throw error;
  //   }
  // }

  // Find user by email (includes password for authentication)
  static async findByEmail(email) {
    const query = "SELECT * FROM user WHERE email = ?";

    try {
      const [rows] = await pool.execute(query, [email]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error finding user by email:", error.message);
      throw error;
    }
  }

  // Find user by ID (excludes password)
  static async findById(id) {
    const query = "SELECT id, name, email FROM user WHERE id = ?";

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error finding user by ID:", error.message);
      throw error;
    }
  }

  // Find user by ID with password (for authentication purposes)
  // static async findByIdWithPassword(id) {
  //   const query = "SELECT * FROM user WHERE id = ?";

  //   try {
  //     const [rows] = await pool.execute(query, [id]);
  //     return rows[0] || null;
  //   } catch (error) {
  //     console.error(
  //       "❌ Error finding user by ID with password:",
  //       error.message
  //     );
  //     throw error;
  //   }
  // }

  // Update username by ID
  static async update(id, userData) {
    const { name } = userData;

    const updateQuery = `
      UPDATE user 
      SET name = ?
      WHERE id = ?
    `;

    const values = [name, id];

    try {
      const [result] = await pool.execute(updateQuery, values);
      return {
        affectedRows: result.affectedRows,
        message: "User updated successfully",
      };
    } catch (error) {
      console.error("❌ Error updating user:", error.message);
      throw error;
    }
  }

  // Update password by ID
  static async updatePassword(id, newPassword) {
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updateQuery = `
      UPDATE user 
      SET password = ?
      WHERE id = ?
    `;

    const values = [hashedPassword, id];

    try {
      const [result] = await pool.execute(updateQuery, values);
      return {
        affectedRows: result.affectedRows,
        message: "Password updated successfully",
      };
    } catch (error) {
      console.error("❌ Error updating password:", error.message);
      throw error;
    }
  }

  // Delete user by ID
  static async delete(id) {
    const query = "DELETE FROM user WHERE id = ?";

    try {
      const [result] = await pool.execute(query, [id]);
      return {
        affectedRows: result.affectedRows,
        message: "User deleted successfully",
      };
    } catch (error) {
      console.error("❌ Error deleting user:", error.message);
      throw error;
    }
  }

  // Verify password (static utility method)
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
