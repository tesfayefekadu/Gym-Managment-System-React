const express = require("express");

const {
  getUsers,
  getUserById,
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ========================================
// USER ROUTES
// ========================================

// Admin + Manager
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  getUsers
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  getUserById
);

module.exports = router;