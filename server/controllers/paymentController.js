const pool = require("../config/db");

// ========================================
// GET ALL PAYMENTS
// ========================================
const getPayments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.member_id,
        m.name AS member_name,
        m.phone AS member_phone,
        p.amount,
        TO_CHAR(p.payment_date, 'YYYY-MM-DD') AS payment_date,
        p.payment_method,
        p.status,
        p.reference_number,
        p.notes,
        p.created_at
      FROM payments p
      INNER JOIN members m
        ON p.member_id = m.id
      ORDER BY p.payment_date DESC, p.id DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get payments error:", error);

    res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

// ========================================
// GET PAYMENT BY ID
// ========================================
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.member_id,
        m.name AS member_name,
        m.phone AS member_phone,
        p.amount,
        TO_CHAR(p.payment_date, 'YYYY-MM-DD') AS payment_date,
        p.payment_method,
        p.status,
        p.reference_number,
        p.notes,
        p.created_at
      FROM payments p
      INNER JOIN members m
        ON p.member_id = m.id
      WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get payment error:", error);

    res.status(500).json({
      message: "Failed to fetch payment",
      error: error.message,
    });
  }
};

// ========================================
// CREATE PAYMENT
// ========================================
const createPayment = async (req, res) => {
  try {
    const {
      member_id,
      amount,
      payment_date,
      payment_method,
      status,
      reference_number,
      notes,
    } = req.body;

    // ======================================
    // VALIDATE MEMBER
    // ======================================

    if (!member_id) {
      return res.status(400).json({
        message: "Member is required",
      });
    }

    // ======================================
    // VALIDATE AMOUNT
    // ======================================

    const paymentAmount = Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      amount === "" ||
      Number.isNaN(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    // ======================================
    // VALIDATE PAYMENT METHOD
    // ======================================

    const validMethods = [
      "Cash",
      "Card",
      "Bank Transfer",
      "Mobile Money",
    ];

    if (
      !payment_method ||
      !validMethods.includes(payment_method)
    ) {
      return res.status(400).json({
        message:
          "Payment method must be Cash, Card, Bank Transfer, or Mobile Money",
      });
    }

    // ======================================
    // VALIDATE STATUS
    // ======================================

    const validStatuses = [
      "Pending",
      "Completed",
      "Failed",
      "Refunded",
    ];

    if (
      !status ||
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          "Status must be Pending, Completed, Failed, or Refunded",
      });
    }

    // ======================================
    // CHECK MEMBER
    // ======================================

    const memberResult = await pool.query(
      `
      SELECT id
      FROM members
      WHERE id = $1
      `,
      [member_id]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // ======================================
    // INSERT PAYMENT
    // ======================================

    const insertResult = await pool.query(
      `
      INSERT INTO payments (
        member_id,
        amount,
        payment_date,
        payment_method,
        status,
        reference_number,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `,
      [
        member_id,
        paymentAmount,
        payment_date || null,
        payment_method,
        status,
        reference_number || null,
        notes || null,
      ]
    );

    const paymentId =
      insertResult.rows[0].id;

    // ======================================
    // RETURN CREATED PAYMENT
    // ======================================

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.member_id,
        m.name AS member_name,
        m.phone AS member_phone,
        p.amount,
        TO_CHAR(p.payment_date, 'YYYY-MM-DD') AS payment_date,
        p.payment_method,
        p.status,
        p.reference_number,
        p.notes,
        p.created_at
      FROM payments p
      INNER JOIN members m
        ON p.member_id = m.id
      WHERE p.id = $1
      `,
      [paymentId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create payment error:", error);

    res.status(500).json({
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE PAYMENT
// ========================================
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      member_id,
      amount,
      payment_date,
      payment_method,
      status,
      reference_number,
      notes,
    } = req.body;

    // ======================================
    // VALIDATE MEMBER
    // ======================================

    if (!member_id) {
      return res.status(400).json({
        message: "Member is required",
      });
    }

    // ======================================
    // VALIDATE AMOUNT
    // ======================================

    const paymentAmount = Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      amount === "" ||
      Number.isNaN(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    // ======================================
    // VALIDATE PAYMENT METHOD
    // ======================================

    const validMethods = [
      "Cash",
      "Card",
      "Bank Transfer",
      "Mobile Money",
    ];

    if (
      !payment_method ||
      !validMethods.includes(payment_method)
    ) {
      return res.status(400).json({
        message:
          "Payment method must be Cash, Card, Bank Transfer, or Mobile Money",
      });
    }

    // ======================================
    // VALIDATE STATUS
    // ======================================

    const validStatuses = [
      "Pending",
      "Completed",
      "Failed",
      "Refunded",
    ];

    if (
      !status ||
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          "Status must be Pending, Completed, Failed, or Refunded",
      });
    }

    // ======================================
    // CHECK MEMBER
    // ======================================

    const memberResult = await pool.query(
      `
      SELECT id
      FROM members
      WHERE id = $1
      `,
      [member_id]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // ======================================
    // UPDATE PAYMENT
    // ======================================

    const updateResult = await pool.query(
      `
      UPDATE payments
      SET
        member_id = $1,
        amount = $2,
        payment_date = $3,
        payment_method = $4,
        status = $5,
        reference_number = $6,
        notes = $7
      WHERE id = $8
      RETURNING id
      `,
      [
        member_id,
        paymentAmount,
        payment_date,
        payment_method,
        status,
        reference_number || null,
        notes || null,
        id,
      ]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // ======================================
    // RETURN UPDATED PAYMENT
    // ======================================

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.member_id,
        m.name AS member_name,
        m.phone AS member_phone,
        p.amount,
        TO_CHAR(p.payment_date, 'YYYY-MM-DD') AS payment_date,
        p.payment_method,
        p.status,
        p.reference_number,
        p.notes,
        p.created_at
      FROM payments p
      INNER JOIN members m
        ON p.member_id = m.id
      WHERE p.id = $1
      `,
      [id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update payment error:", error);

    res.status(500).json({
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

// ========================================
// DELETE PAYMENT
// ========================================
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM payments
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      message: "Payment deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Delete payment error:", error);

    res.status(500).json({
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};