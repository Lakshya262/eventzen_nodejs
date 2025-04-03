require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ✅ Correct CORS Setup
const allowedOrigins = [process.env.CORS_ORIGIN || "http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    exposedHeaders: ["Authorization", "X-New-Token"],
  })
);

// ✅ Middleware Order: CORS → Body Parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Security Headers Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  next();
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// ✅ Health Check Endpoint
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message,
    });
  }
});

// ✅ 404 Handler for Unmatched Routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// ✅ Error Handling Middleware (Must Be Last)
app.use(errorHandler);

// ✅ Database Connection & Server Startup
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({
      force: false, // ⛔ Avoid using force in production
      alter: process.env.NODE_ENV === "development",
    });
    console.log("✅ Database synced");

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // ✅ Graceful Shutdown
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}, shutting down gracefully...`);
      try {
        await sequelize.close();
        console.log("✅ Database connection closed");

        server.close(() => {
          console.log("✅ Server closed");
          process.exit(0);
        });

        setTimeout(() => {
          console.error("⚠️ Forcing shutdown after timeout");
          process.exit(1);
        }, 5000);
      } catch (err) {
        console.error("❌ Error during shutdown:", err);
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("uncaughtException", (err) => {
      console.error("⚠️ Uncaught Exception:", err);
      shutdown("uncaughtException");
    });
    process.on("unhandledRejection", (reason, promise) => {
      console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
      shutdown("unhandledRejection");
    });

  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

// ✅ Start the Server
startServer();
