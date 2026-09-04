const express = require("express");

const {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} = require("../controllers/trainerController");


const router = express.Router();


// ========================================
// GET ALL TRAINERS
// ========================================

router.get(
  "/",
  getTrainers
);


// ========================================
// GET SINGLE TRAINER
// ========================================

router.get(
  "/:id",
  getTrainerById
);


// ========================================
// CREATE TRAINER
// ========================================

router.post(
  "/",
  createTrainer
);


// ========================================
// UPDATE TRAINER
// ========================================

router.put(
  "/:id",
  updateTrainer
);


// ========================================
// DELETE TRAINER
// ========================================

router.delete(
  "/:id",
  deleteTrainer
);


module.exports = router;