const express = require("express");

const {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const requireWoreda = require("../middleware/woredaMiddleware");

const router = express.Router();

// ========================================
// ATTENDANCE ROUTES
// Admin   -> all Woredas
// Manager -> own Woreda only
// Staff   -> own Woreda only (front-desk work: view, record, correct)
// Delete is Admin / Manager only.
// ========================================

// GET ALL ATTENDANCE
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  getAttendance
);

// GET SINGLE ATTENDANCE
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  getAttendanceById
);

// CREATE ATTENDANCE
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  createAttendance
);

// UPDATE ATTENDANCE
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  updateAttendance
);

// DELETE ATTENDANCE
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  deleteAttendance
);

module.exports = router;