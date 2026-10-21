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
const requireWoreda = require("../middleware/woredaMiddleware");

const router = express.Router();

// ========================================
// TRAINER ROUTES
// Admin   -> all Woredas
// Manager -> own Woreda only
// Staff   -> no access (trainer data includes salary)
// ========================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  getTrainers
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  getTrainerById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  createTrainer
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  updateTrainer
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  deleteTrainer
);

module.exports = router;
