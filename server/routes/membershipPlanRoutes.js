
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
const requireWoreda = require("../middleware/woredaMiddleware");

const router = express.Router();

// All three roles can view plans in their permitted scope.
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  getMembershipPlans
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  getMembershipPlanById
);

// Only Admin and Manager can manage plans.
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  createMembershipPlan
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  updateMembershipPlan
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  deleteMembershipPlan
);

module.exports = router;