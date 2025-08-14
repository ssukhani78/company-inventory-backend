const mysql = require("mysql2");
require("dotenv").config();

// Database configuration with improved connection settings for ByetHost
const dbConfig = {
  host: process.env.DB_HOST, // or 'localhost'
  port: 3306, // default
  user: process.env.DB_USER, // your MySQL user
  password: process.env.DB_PASSWORD, // set your password
  database: process.env.DB_NAME, // or whatever DB name you created
};

// Create connection
const connection = mysql.createConnection(dbConfig);

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to database:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database successfully");

  // Create tables
  createTables();
});

// Function to create all tables
function createTables() {
  const tables = [
    {
      name: "company",
      query: `
        CREATE TABLE IF NOT EXISTS company (
          id CHAR(36) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          gstNo VARCHAR(20) NOT NULL UNIQUE,
          email VARCHAR(100) DEFAULT NULL,
          phone VARCHAR(20) DEFAULT NULL,
          address TEXT NOT NULL,
          city VARCHAR(50) NOT NULL,
          state VARCHAR(50) NOT NULL,
          pincode VARCHAR(10) NOT NULL,
          status ENUM('active', 'inactive') NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `,
    },
    {
      name: "item",
      query: `
        CREATE TABLE IF NOT EXISTS item (
          id CHAR(36) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          hsnCode VARCHAR(20) NOT NULL,
          description TEXT DEFAULT NULL,
          status ENUM('active', 'inactive') NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `,
    },
    {
      name: "user",
      query: `
        CREATE TABLE IF NOT EXISTS user (
          id CHAR(36) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        )
      `,
    },
    {
      name: "sales",
      query: `
        CREATE TABLE IF NOT EXISTS sales (
          id CHAR(36) PRIMARY KEY,
          companyId CHAR(36) NOT NULL,
          itemId CHAR(36) NOT NULL,
          unit enum('box','kgs','mtr','ltr','pcs','roll','pkt','nos','bundle','lot') NOT NULL,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (companyId) REFERENCES company(id),
          FOREIGN KEY (itemId) REFERENCES item(id)
        )
      `,
    },
  ];

  let tablesCreated = 0;
  const totalTables = tables.length;

  tables.forEach((table) => {
    connection.query(table.query, (err, results) => {
      if (err) {
        console.error(`❌ Error creating ${table.name} table:`, err.message);
        connection.end();
        process.exit(1);
      } else {
        console.log(
          `✅ ${table.name} table created successfully (or already exists)`
        );
        tablesCreated++;

        // Close connection after all tables are created
        if (tablesCreated === totalTables) {
          console.log("🎉 All tables created successfully!");
          connection.end((err) => {
            if (err) {
              console.error("❌ Error closing connection:", err.message);
            } else {
              console.log("✅ Database connection closed");
            }
            process.exit(0);
          });
        }
      }
    });
  });
}
