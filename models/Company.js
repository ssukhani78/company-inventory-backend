const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Company {
  // Create company table if it doesn't exist
  // static async createTable() {
  //   const createTableQuery = `
  //     CREATE TABLE IF NOT EXISTS companies (
  //       id INT AUTO_INCREMENT PRIMARY KEY,
  //       name VARCHAR(255) NOT NULL,
  //       email VARCHAR(255) UNIQUE,
  //       phone VARCHAR(20),
  //       address TEXT,
  //       industry VARCHAR(100),
  //       founded_year INT,
  //       employee_count INT,
  //       website VARCHAR(255),
  //       description TEXT,
  //       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  //     )
  //   `;
    
  //   try {
  //     await pool.execute(createTableQuery);
  //     console.log('✅ Companies table created/verified successfully');
  //   } catch (error) {
  //     console.error('❌ Error creating companies table:', error.message);
  //     throw error;
  //   }
  // }

  // Insert a new company
  static async create(companyData) {
    const {
      name,
      gstNo,
      email,
      phone,
      address,
      city,
      state,
      pincode
    } = companyData;

    const insertQuery = `
      INSERT INTO company 
      (id,name, gstNo, email, phone, address, city, state, pincode, status)
      VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const id = uuidv4();

    const values = [
        id,
        name,
        gstNo,
        email,  
        phone,
        address,
        city,
        state,
        pincode,
        'active'
    ];

    try {
      const [result] = await pool.execute(insertQuery, values);
      return {
        id: id,
        ...companyData,
        message: 'Company created successfully'
      };
    } catch (error) {
      console.error('❌ Error creating company:', error.message);
      throw error;
    }
  }

  // Get all companies
  static async getAll() {
    const query = 'SELECT * FROM company ORDER BY createdAt asc';

    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error('❌ Error fetching companies:', error.message);
      throw error;
    }
  }

  // Get company by ID
  static async getById(id) {
    const query = 'SELECT * FROM company WHERE id = ?';
    
    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('❌ Error fetching company:', error.message);
      throw error;
    } 
  }

  static async findByEmailAndPinCode(email, pinCode) {
    try{
      const query = 'SELECT * FROM company WHERE email = ? AND pincode = ?';
      const values = [email, pinCode];
      const [rows] = await pool.execute(query, values);
      return rows[0];
    } catch (error) {
      console.error('❌ Error finding company by email and pin code:', error.message);
      throw error;
    }
  }

  // Update company
  static async update(id, companyData,) {
    const updateQuery = `
      UPDATE company 
      SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, pincode = ?, gstNo = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const values = [
      companyData.name,
      companyData.email,
      companyData.phone,
      companyData.address,
      companyData.city,
      companyData.state,
      companyData.pincode,
      companyData.gstNo,
      companyData.status,
      id
    ];

    try {
      const [result] = await pool.execute(updateQuery, values);
      return {
        affectedRows: result.affectedRows,
        message: 'Company updated successfully'
      };
    } catch (error) {
      console.error('❌ Error updating company:', error.message);
      throw error;
    }
  }

  // Delete company
  static async delete(id) {
    const query = 'DELETE FROM company WHERE id = ?';
    
    try {
      const [result] = await pool.execute(query, [id]);
      return {
        affectedRows: result.affectedRows,
        message: 'Company deleted successfully'
      };
    } catch (error) {
      console.error('❌ Error deleting company:', error.message);
      throw error;
    }
  }
}

module.exports = Company; 