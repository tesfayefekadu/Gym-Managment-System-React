const express = require("express");

const {
  getWoredas,
  getWoredaById,
  createWoreda,
  updateWoreda,
} = require("../controllers/woredaController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ADMIN ONLY

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin"),
  getWoredas
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  getWoredaById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin"),
  createWoreda
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  updateWoreda
);

module.exports = router;