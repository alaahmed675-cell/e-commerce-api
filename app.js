// app.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const AppError = require("./utils/AppError");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const seedRouter = require("./routes/seedRouter"); // بدل import

const app = express();

// Global middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}
app.use(requestLogger);

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Product Management API is running" });
});

// API routes
app.use("/api", require("./routes")); // لو عندك routes index.js
app.use("/seed", seedRouter); // هنا استخدمنا seedRouter

// // 404 handler
// app.all("*", (req, res, next) => {
//   next(new AppError(`Route ${req.originalUrl} not found`, 404));
// });

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;

// Global error handler
app.use(errorHandler);

module.exports = app;
