const mysql = require('mysql2');
require('dotenv').config();
// Connection setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});

// Dummy data
const companies = [
  ['TechNova Inc.', 'San Francisco, CA', 'Technology', 2010, '$120M'],
  ['GreenHarvest Ltd.', 'Iowa, USA', 'Agriculture', 2005, '$75M'],
  ['UrbanBuild Co.', 'New York, NY', 'Construction', 2012, '$200M'],
  ['FinGenius Corp.', 'London, UK', 'Finance', 2008, '$310M'],
  ['MediLife Pvt. Ltd.', 'Mumbai, India', 'Healthcare', 2015, '$90M'],
  ['EduSmart Inc.', 'Austin, TX', 'Education', 2011, '$60M'],
  ['EcoDrive Motors', 'Berlin, Germany', 'Automobile', 2009, '$400M'],
  ['FoodiesHub', 'Toronto, Canada', 'Food & Beverage', 2013, '$45M'],
  ['SkyNet Systems', 'Tokyo, Japan', 'IT Services', 2007, '$500M'],
  ['BioZen Pharma', 'Zurich, Switzerland', 'Pharmaceuticals', 2014, '$150M']
];

// Insert query
const insertQuery = `
  INSERT INTO company (name, location, industry, founded_year, revenue)
  VALUES ?
`;

// Connect and insert
connection.connect((err) => {
  if (err) {
    return console.error('❌ Database connection error:', err.message);
  }

  console.log('✅ Connected to database! Inserting data...');

  connection.query(insertQuery, [companies], (err, results) => {
    if (err) {
      console.error('❌ Error inserting data:', err.message);
    } else {
      console.log(`✅ Successfully inserted ${results.affectedRows} rows!`);
    }

    // Close connection
    connection.end();
  });
});
