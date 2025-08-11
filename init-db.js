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
      name: "Company",
      query: `
        CREATE TABLE IF NOT EXISTS Company (
          id CHAR(36) PRIMARY KEY,
          name VARCHAR(100),
          gstNo VARCHAR(20),
          email VARCHAR(100),
          phone VARCHAR(20),
          address TEXT,
          city VARCHAR(50),
          state VARCHAR(50),
          pincode VARCHAR(10),
          status ENUM('active', 'inactive')
        )
      `,
    },
    {
      name: "Item",
      query: `
        CREATE TABLE IF NOT EXISTS Item (
          id CHAR(36) PRIMARY KEY,
          itemName VARCHAR(100),
          hsnCode VARCHAR(20),
          description TEXT,
          status ENUM('active', 'inactive')
        )
      `,
    },
    {
      name: "Sales",
      query: `
        CREATE TABLE IF NOT EXISTS Sales (
          id CHAR(36) PRIMARY KEY,
          companyId CHAR(36),
          itemId CHAR(36),
          date DATE,
          FOREIGN KEY (companyId) REFERENCES Company(id),
          FOREIGN KEY (itemId) REFERENCES Item(id)
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
