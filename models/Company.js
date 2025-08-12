const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Company {
 

  // Insert a new company
  static async create(companyData) {
    let {
      name,
      gstNo,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      status
    } = companyData;

    email = email ? email : null;
    phone = phone ? phone : null;

    if(phone && phone.length === 10){
      phone = `+91${phone}`;
    }

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
        status
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

  static async findByGstNo(gstNo) {
    try{
      const query = 'SELECT * FROM company WHERE gstNo = ?';
      const values = [gstNo];
      const [rows] = await pool.execute(query, values);
      return rows[0];
    } catch (error) {
      console.error('❌ Error finding company by email and pin code:', error.message);
      throw error;
    }
  }

  // Update company
  static async update(id, companyData) {
    const updateQuery = `
      UPDATE company 
      SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, pincode = ?, gstNo = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    companyData.email = companyData.email ? companyData.email : null;
    companyData.phone = companyData.phone ? companyData.phone : null;

    if(companyData.phone && companyData.phone.length === 10){
      companyData.phone = `+91${companyData.phone}`;
    }

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

  // Delete company (hard delete)
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