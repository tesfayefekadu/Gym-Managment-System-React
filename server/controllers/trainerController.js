const pool = require("../config/db");
const getWoredaScope = require("../utils/woredaScope");

// ========================================
// HELPERS
// ========================================

const isValidId = (id) =>
  Number.isInteger(Number(id)) && Number(id) > 0;

const TRAINER_COLUMNS = `
  id,
  name,
  gender,
  phone,
  email,
  specialization,
  experience,
  salary,
  TO_CHAR(hire_date, 'YYYY-MM-DD') AS "hireDate",
  status,
  woreda_id,
  created_at
`;

// ========================================
// GET ALL TRAINERS
// Admin: all Woredas | Manager: own Woreda
// ========================================

const getTrainers = async (req, res) => {
  try {
    const woredaId = getWoredaScope(req);

    let query = `SELECT ${TRAINER_COLUMNS} FROM trainers`;
    const values = [];

    if (woredaId !== null) {
      query += ` WHERE woreda_id = $1`;
      values.push(woredaId);
    }

    query += ` ORDER BY id DESC`;

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get trainers error:", error);

    res.status(500).json({
      message: "Failed to fetch trainers",
    });
  }
};

// ========================================
// GET SINGLE TRAINER
// ========================================

const getTrainerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid trainer ID",
      });
    }

    const woredaId = getWoredaScope(req);

    let query = `SELECT ${TRAINER_COLUMNS} FROM trainers WHERE id = $1`;
    const values = [id];

    if (woredaId !== null) {
      query += ` AND woreda_id = $2`;
      values.push(woredaId);
    }

    const result = await pool.query(query, values);

    // 404 (not 403) when the trainer exists in another Woreda,
    // so IDs from other Woredas are not revealed.
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Trainer not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get trainer error:", error);

    res.status(500).json({
      message: "Failed to fetch trainer",
    });
  }
};

// ========================================
// CREATE TRAINER
// Admin: must choose woreda_id in the body
// Manager: automatically uses own Woreda
// ========================================

const createTrainer = async (req, res) => {
  try {
    const {
      name,
      gender,
      phone,
      email,
      specialization,
      experience,
      salary,
      status,
    } = req.body;

    // The React form sends hireDate; also accept hire_date
    const hire_date = req.body.hire_date ?? req.body.hireDate;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Trainer name is required",
      });
    }

    // Determine target Woreda
    const finalWoredaId =
      req.user.role === "Admin"
        ? req.body.woreda_id
        : req.user.woreda_id;

    if (!finalWoredaId || !isValidId(finalWoredaId)) {
      return res.status(400).json({
        message: "Woreda is required",
      });
    }

    // Admin: verify the chosen Woreda exists
    if (req.user.role === "Admin") {
      const woredaResult = await pool.query(
        `SELECT id FROM woredas WHERE id = $1`,
        [finalWoredaId]
      );

      if (woredaResult.rows.length === 0) {
        return res.status(400).json({
          message: "Selected woreda does not exist",
        });
      }
    }

    const result = await pool.query(
      `
      INSERT INTO trainers (
        name,
        gender,
        phone,
        email,
        specialization,
        experience,
        salary,
        hire_date,
        status,
        woreda_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING ${TRAINER_COLUMNS}
      `,
      [
        name.trim(),
        gender || null,
        phone || null,
        email || null,
        specialization || null,
        experience ?? 0,
        salary || null,
        hire_date || null,
        status || "Active",
        finalWoredaId,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create trainer error:", error);

    // Duplicate email
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A trainer with this email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create trainer",
    });
  }
};

// ========================================
// UPDATE TRAINER
// A trainer cannot be moved to another Woreda here.
// ========================================

const updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid trainer ID",
      });
    }

    const {
      name,
      gender,
      phone,
      email,
      specialization,
      experience,
      salary,
      status,
    } = req.body;

    // The React form sends hireDate; also accept hire_date
    const hire_date = req.body.hire_date ?? req.body.hireDate;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Trainer name is required",
      });
    }

    const woredaId = getWoredaScope(req);

    const values = [
      name.trim(),
      gender || null,
      phone || null,
      email || null,
      specialization || null,
      experience ?? 0,
      salary || null,
      hire_date || null,
      status || "Active",
      id,
    ];

    let query = `
      UPDATE trainers
      SET
        name = $1,
        gender = $2,
        phone = $3,
        email = $4,
        specialization = $5,
        experience = $6,
        salary = $7,
        hire_date = $8,
        status = $9
      WHERE id = $10
    `;

    if (woredaId !== null) {
      query += ` AND woreda_id = $11`;
      values.push(woredaId);
    }

    query += ` RETURNING ${TRAINER_COLUMNS}`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Trainer not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update trainer error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "A trainer with this email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update trainer",
    });
  }
};

// ========================================
// DELETE TRAINER
// ========================================

const deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid trainer ID",
      });
    }

    const woredaId = getWoredaScope(req);

    let query = `DELETE FROM trainers WHERE id = $1`;
    const values = [id];

    if (woredaId !== null) {
      query += ` AND woreda_id = $2`;
      values.push(woredaId);
    }

    query += ` RETURNING id`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      message: "Trainer deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Delete trainer error:", error);

    // Trainer still referenced by another table
    if (error.code === "23503") {
      return res.status(409).json({
        message:
          "Trainer is in use and cannot be deleted. Set status to Inactive instead.",
      });
    }

    res.status(500).json({
      message: "Failed to delete trainer",
    });
  }
};

module.exports = {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
};
