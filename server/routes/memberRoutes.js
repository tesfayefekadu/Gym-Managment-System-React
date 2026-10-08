const express = require("express");

const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");

const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const requireWoreda = require("../middleware/woredaMiddleware");

// ========================================
// MEMBER ROUTES
// ========================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  getMembers
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  getMemberById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  createMember
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  updateMember
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  deleteMember
);

module.exports = router;