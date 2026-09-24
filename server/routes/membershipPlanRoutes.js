const express = require("express");

const {
  getMembershipPlans,
  getMembershipPlanById,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} = require("../controllers/membershipPlanController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ========================================
// MEMBERSHIP PLAN ROUTES
// ========================================

// GET ALL PLANS
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  getMembershipPlans
);

// GET SINGLE PLAN
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  getMembershipPlanById
);

// CREATE PLAN
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  createMembershipPlan
);

// UPDATE PLAN
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  updateMembershipPlan
);

// DELETE PLAN
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  deleteMembershipPlan
);

module.exports = router;