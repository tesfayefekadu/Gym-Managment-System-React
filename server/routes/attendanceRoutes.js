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

const router = express.Router();

// ========================================
// ATTENDANCE ROUTES
// ========================================

// GET ALL ATTENDANCE
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  getAttendance
);

// GET SINGLE ATTENDANCE
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  getAttendanceById
);

// CREATE ATTENDANCE
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  createAttendance
);

// UPDATE ATTENDANCE
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  updateAttendance
);

// DELETE ATTENDANCE
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  deleteAttendance
);

module.exports = router;