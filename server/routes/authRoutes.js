const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
} = require("../controllers/authController");

const validate = require("../middleware/validationMiddleware");

const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");

const router = express.Router();

// Limit authentication requests
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Maximum 20 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication requests. Please try again later.",
  },
});

// Register
router.post(
  "/register",
  authLimiter,
  registerValidation,
  validate,
  register
);

// Login
router.post(
  "/login",
  authLimiter,
  loginValidation,
  validate,
  login
);

module.exports = router;