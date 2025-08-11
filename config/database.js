const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: 'localhost',         // or 'localhost'
  port: 3306,                // default
  user: 'root',              // your MySQL user
  password: '12345', // set your password
  database: 'viewList',      // or whatever DB name you created
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  testConnection
}; 