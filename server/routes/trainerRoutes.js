const express = require("express");

const {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} = require("../controllers/trainerController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ========================================
// TRAINER ROUTES
// ========================================

// GET ALL TRAINERS
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  getTrainers
);

// GET SINGLE TRAINER
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  getTrainerById
);

// CREATE TRAINER
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  createTrainer
);

// UPDATE TRAINER
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  updateTrainer
);

// DELETE TRAINER
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  deleteTrainer
);

module.exports = router;