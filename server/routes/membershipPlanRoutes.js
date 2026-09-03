const express = require("express");

const {
  getMembershipPlans,
  getMembershipPlanById,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} = require("../controllers/membershipPlanController");

const router = express.Router();

router.get("/", getMembershipPlans);
router.get("/:id", getMembershipPlanById);
router.post("/", createMembershipPlan);
router.put("/:id", updateMembershipPlan);
router.delete("/:id", deleteMembershipPlan);

module.exports = router;