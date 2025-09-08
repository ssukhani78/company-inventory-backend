const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/database");
const companyRoutes = require("./routes/companyRoutes");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");
const salesRoutes = require("./routes/salesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "https://view-list-app.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/company", companyRoutes);
app.use("/item", itemRoutes);
app.use("/auth", userRoutes);
app.use("/sales", salesRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Company Management API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      auth: {
        register: "POST /auth/register",
        login: "POST /auth/login",
        profile: "GET /auth/profile (requires token)",
      },
      companies: {
        getAll: "GET /company",
        getById: "GET /company/:id",
        create: "POST /company",
        update: "PUT /company/:id",
        delete: "DELETE /company/:id",
        stats: "GET /company/stats",
      },
      items: {
        getAll: "GET /item",
        getById: "GET /item/:id",
        create: "POST /item",
        update: "PUT /item/:id",
        delete: "DELETE /item/:id",
        getByHsnCode: "GET /item/hsn/:hsnCode",
      },
      sales: {
        getAll: "GET /sales",
        getById: "GET /sales/:id",
        create: "POST /sales",
        update: "PUT /sales/:id",
        delete: "DELETE /sales/:id",
      },
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Initialize database and start server
// const startServer = async () => {
//   try {
//     // Test database connection
//     await testConnection();

//     // Start server
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📊 Environment: ${process.env.NODE_ENV}`);
//       console.log(`🔗 API Base URL: http://localhost:${PORT}`);
//       console.log(`📋 API Documentation: http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("❌ Failed to start server:", error.message);
//     process.exit(1);
//   }
// };

// startServer();

// Test database connection when the module loads (optional, recommended for Vercel)
testConnection().catch((err) => {
  console.error("DB connection failed:", err.message);
});

// Export the Express app for Vercel
module.exports = app;
