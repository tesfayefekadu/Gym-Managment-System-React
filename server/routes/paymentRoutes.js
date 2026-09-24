const express = require("express");

const {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// GET ALL PAYMENTS
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  getPayments
);

// GET PAYMENT BY ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  getPaymentById
);

// CREATE PAYMENT
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  createPayment
);

// UPDATE PAYMENT
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  updatePayment
);

// DELETE PAYMENT
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  deletePayment
);

module.exports = router;