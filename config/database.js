const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,         // or 'localhost'
  // port: process.env.DB_PORT,                // default
  user: process.env.DB_USER,              // your MySQL user
  password: process.env.DB_PASSWORD, // set your password
  database: process.env.DB_NAME,      // or whatever DB name you created
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