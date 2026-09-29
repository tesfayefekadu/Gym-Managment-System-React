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

// ========================================
// MEMBER ROUTES
// ========================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  getMembers
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  getMemberById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  createMember
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  updateMember
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  deleteMember
);

module.exports = router;