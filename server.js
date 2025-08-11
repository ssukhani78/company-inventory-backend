const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const companyRoutes = require('./routes/companyRoutes');
const itemRoutes = require('./routes/itemRoutes');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/company', companyRoutes);
app.use('/item', itemRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Company Management API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      companies: {
        getAll: 'GET /company',
        getById: 'GET /company/:id',
        create: 'POST /company',
        update: 'PUT /company/:id',
        delete: 'DELETE /company/:id',
        stats: 'GET /company/stats',
      },
      items: {
        getAll: 'GET /item',
        getById: 'GET /item/:id',
        create: 'POST /item',
        update: 'PUT /item/:id',
        delete: 'DELETE /item/:id',
        getByHsnCode: 'GET /item/hsn/:hsnCode'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Create company table if it doesn't exist
    // await Company.createTable();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}`);
      console.log(`📋 API Documentation: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer(); 