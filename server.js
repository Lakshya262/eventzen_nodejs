require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  exposedHeaders: ["Authorization", "X-New-Token"] 
}));

// Body parser middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Security headers middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({ // Using 503 for service unavailable
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message
    });
  }
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Sync models
    await sequelize.sync({
      force: process.env.NODE_ENV === "test", 
      alter: process.env.NODE_ENV === "development" 
      
    });
    console.log("✅ Database synced");

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown handler
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}, shutting down gracefully...`);
      try {
        await sequelize.close();
        console.log("✅ Database connection closed");
        
        server.close(() => {
          console.log("✅ Server closed");
          process.exit(0);
        });
        
        // Force shutdown if hanging
        setTimeout(() => {
          console.error("⚠️ Forcing shutdown after timeout");
          process.exit(1);
        }, 5000);
      } catch (err) {
        console.error("❌ Error during shutdown:", err);
        process.exit(1);
      }
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    
    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("⚠️ Uncaught Exception:", err);
      shutdown("uncaughtException");
    });
    
    // Handle unhandled rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
      shutdown("unhandledRejection");
    });
    
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

// Start the server
startServer();