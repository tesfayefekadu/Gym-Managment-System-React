const express = require("express");

const {
  getUsers,
  getUserById,
  createManagedUser,
} = require("../controllers/userController");

const validate = require("../middleware/validationMiddleware");

const {
  createManagedUserValidation,
} = require("../validators/userValidator");

const requireWoreda = require("../middleware/woredaMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ========================================
// USER ROUTES
// ========================================

// ========================================
// GET ALL USERS
// Admin → all users
// Manager → only users in their Woreda
// ========================================
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  getUsers
);

// ========================================
// GET USER BY ID
// Admin → any user
// Manager → only users in their Woreda
// ========================================
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  getUserById
);

// ========================================
// CREATE MANAGED USER
// Admin → Manager only
// Manager → Staff only
// ========================================

console.log("createManagedUser:", typeof createManagedUser);
console.log("validate:", typeof validate);
console.log(
  "createManagedUserValidation:",
  Array.isArray(createManagedUserValidation),
  typeof createManagedUserValidation
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  createManagedUserValidation,
  validate,
  createManagedUser
  
);

module.exports = router;