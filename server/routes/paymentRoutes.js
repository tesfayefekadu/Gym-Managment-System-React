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
const requireWoreda = require("../middleware/woredaMiddleware");

const router = express.Router();

// ========================================
// PAYMENT ROUTES
// Admin   -> all Woredas
// Manager -> own Woreda only
// Staff   -> own Woreda only; can view and record payments,
//            but cannot edit or delete them (financial integrity)
// ========================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  getPayments
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  getPaymentById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager", "Staff"),
  requireWoreda,
  createPayment
);

// Staff removed here. To let Staff edit payments again,
// add "Staff" back to this list.
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  updatePayment
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  requireWoreda,
  deletePayment
);

module.exports = router;
