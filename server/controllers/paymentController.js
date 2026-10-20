const pool = require("../config/db");
const getWoredaScope = require("../utils/woredaScope");

// ========================================
// HELPERS
// ========================================

const isValidId = (id) =>
  Number.isInteger(Number(id)) && Number(id) > 0;

const VALID_METHODS = ["Cash", "Card", "Bank Transfer", "Mobile Money"];
const VALID_STATUSES = ["Pending", "Completed", "Failed", "Refunded"];

// Payments have no woreda column of their own.
// A payment belongs to the Woreda of its member (members.woreda_id).
const PAYMENT_SELECT = `
  SELECT
    p.id,
    p.member_id,
    m.name AS member_name,
    m.phone AS member_phone,
    m.woreda_id,
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
`;

// Returns an error message string, or null when the body is valid.
const validatePaymentBody = (body) => {
  const { member_id, amount, payment_method, status } = body;

  if (!member_id || !isValidId(member_id)) {
    return "Member is required";
  }

  const paymentAmount = Number(amount);

  if (
    amount === undefined ||
    amount === null ||
    amount === "" ||
    Number.isNaN(paymentAmount) ||
    paymentAmount <= 0
  ) {
    return "Amount must be greater than 0";
  }

  if (!payment_method || !VALID_METHODS.includes(payment_method)) {
    return "Payment method must be Cash, Card, Bank Transfer, or Mobile Money";
  }

  if (!status || !VALID_STATUSES.includes(status)) {
    return "Status must be Pending, Completed, Failed, or Refunded";
  }

  return null;
};

// Confirms the member exists AND is inside the caller's Woreda.
// Admin (woredaId === null) can use any member.
const memberInScope = async (memberId, woredaId) => {
  let query = `SELECT id FROM members WHERE id = $1`;
  const values = [memberId];

  if (woredaId !== null) {
    query += ` AND woreda_id = $2`;
    values.push(woredaId);
  }

  const result = await pool.query(query, values);
  return result.rows.length > 0;
};

// ========================================
// GET ALL PAYMENTS
// ========================================
const getPayments = async (req, res) => {
  try {
    const woredaId = getWoredaScope(req);

    let query = PAYMENT_SELECT;
    const values = [];

    if (woredaId !== null) {
      query += ` WHERE m.woreda_id = $1`;
      values.push(woredaId);
    }

    query += ` ORDER BY p.payment_date DESC, p.id DESC`;

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get payments error:", error);

    res.status(500).json({
      message: "Failed to fetch payments",
    });
  }
};

// ========================================
// GET PAYMENT BY ID
// ========================================
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid payment ID",
      });
    }

    const woredaId = getWoredaScope(req);

    let query = PAYMENT_SELECT + ` WHERE p.id = $1`;
    const values = [id];

    if (woredaId !== null) {
      query += ` AND m.woreda_id = $2`;
      values.push(woredaId);
    }

    const result = await pool.query(query, values);

    // 404 rather than 403 so other Woredas' payment IDs are not revealed
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
    });
  }
};

// ========================================
// CREATE PAYMENT
// The member must belong to the caller's Woreda.
// ========================================
const createPayment = async (req, res) => {
  try {
    const validationError = validatePaymentBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const {
      member_id,
      amount,
      payment_date,
      payment_method,
      status,
      reference_number,
      notes,
    } = req.body;

    const woredaId = getWoredaScope(req);

    if (!(await memberInScope(member_id, woredaId))) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

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
        Number(amount),
        payment_date || null,
        payment_method,
        status,
        reference_number || null,
        notes || null,
      ]
    );

    const result = await pool.query(PAYMENT_SELECT + ` WHERE p.id = $1`, [
      insertResult.rows[0].id,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create payment error:", error);

    res.status(500).json({
      message: "Failed to create payment",
    });
  }
};

// ========================================
// UPDATE PAYMENT (Admin / Manager only, see routes)
// Both the existing payment and the (new) member
// must be inside the caller's Woreda.
// ========================================
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid payment ID",
      });
    }

    const validationError = validatePaymentBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const {
      member_id,
      amount,
      payment_date,
      payment_method,
      status,
      reference_number,
      notes,
    } = req.body;

    const woredaId = getWoredaScope(req);

    // 1. The payment being edited must be in scope
    let existingQuery = `
      SELECT p.id
      FROM payments p
      INNER JOIN members m ON p.member_id = m.id
      WHERE p.id = $1
    `;
    const existingValues = [id];

    if (woredaId !== null) {
      existingQuery += ` AND m.woreda_id = $2`;
      existingValues.push(woredaId);
    }

    const existing = await pool.query(existingQuery, existingValues);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // 2. The member it is being assigned to must be in scope too
    if (!(await memberInScope(member_id, woredaId))) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    await pool.query(
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
      `,
      [
        member_id,
        Number(amount),
        payment_date || null,
        payment_method,
        status,
        reference_number || null,
        notes || null,
        id,
      ]
    );

    const result = await pool.query(PAYMENT_SELECT + ` WHERE p.id = $1`, [id]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update payment error:", error);

    res.status(500).json({
      message: "Failed to update payment",
    });
  }
};

// ========================================
// DELETE PAYMENT (Admin / Manager only, see routes)
// ========================================
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid payment ID",
      });
    }

    const woredaId = getWoredaScope(req);

    let query = `DELETE FROM payments WHERE id = $1`;
    const values = [id];

    if (woredaId !== null) {
      query += `
        AND member_id IN (
          SELECT id FROM members WHERE woreda_id = $2
        )
      `;
      values.push(woredaId);
    }

    query += ` RETURNING id`;

    const result = await pool.query(query, values);

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
