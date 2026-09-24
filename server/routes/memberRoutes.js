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

// GET all members
router.get("/", getMembers);

// GET one member
router.get("/:id", getMemberById);

// CREATE member
router.post("/", createMember);

// UPDATE member
router.put("/:id", updateMember);

// DELETE member
router.delete("/:id", deleteMember);

module.exports = router;