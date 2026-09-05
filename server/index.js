const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const memberRoutes = require("./routes/memberRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const membershipPlanRoutes = require("./routes/membershipPlanRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/members", memberRoutes);
app.use("/api/trainers",trainerRoutes);
app.use("/api/membership-plans",membershipPlanRoutes);
app.use("/api/attendance", attendanceRoutes);


// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Gym Management API is running",
  });
});

// Database test route
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time"
    );

    res.json({
      status: "success",
      message: "API and PostgreSQL are connected",
      databaseTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});