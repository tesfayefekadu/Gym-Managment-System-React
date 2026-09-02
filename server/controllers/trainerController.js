const pool = require("../config/db");


// ========================================
// GET ALL TRAINERS
// ========================================

const getTrainers = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        id,
        name,
        gender,
        phone,
        email,
        specialization,
        experience,
        salary,
        hire_date,
        status,
        created_at
      FROM trainers
      ORDER BY id DESC
    `);

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(
      "Get trainers error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch trainers",
      error: error.message,
    });

  }
};


// ========================================
// GET SINGLE TRAINER
// ========================================

const getTrainerById = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        gender,
        phone,
        email,
        specialization,
        experience,
        salary,
        hire_date,
        status,
        created_at
      FROM trainers
      WHERE id = $1
      `,
      [id]
    );


    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "Trainer not found",
      });

    }


    res.status(200).json(
      result.rows[0]
    );

  } catch (error) {

    console.error(
      "Get trainer error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch trainer",
      error: error.message,
    });

  }
};


// ========================================
// CREATE TRAINER
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
      hire_date,
      status,
    } = req.body;


    // ------------------------------------
    // Validation
    // ------------------------------------

    if (!name || !name.trim()) {

      return res.status(400).json({
        message: "Trainer name is required",
      });

    }


    // ------------------------------------
    // Insert Trainer
    // ------------------------------------

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
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      )
      RETURNING
        id
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
      ]
    );


    const trainerId =
      result.rows[0].id;


    // ------------------------------------
    // Return Created Trainer
    // ------------------------------------

    const trainerResult =
      await pool.query(
        `
        SELECT
          id,
          name,
          gender,
          phone,
          email,
          specialization,
          experience,
          salary,
          hire_date,
          status,
          created_at
        FROM trainers
        WHERE id = $1
        `,
        [trainerId]
      );


    res.status(201).json(
      trainerResult.rows[0]
    );

  } catch (error) {

    console.error(
      "Create trainer error:",
      error
    );


    // Duplicate email
    if (error.code === "23505") {

      return res.status(409).json({
        message:
          "A trainer with this email already exists",
      });

    }


    res.status(500).json({
      message: "Failed to create trainer",
      error: error.message,
    });

  }
};


// ========================================
// UPDATE TRAINER
// ========================================

const updateTrainer = async (req, res) => {

  try {

    const { id } = req.params;


    const {
      name,
      gender,
      phone,
      email,
      specialization,
      experience,
      salary,
      hire_date,
      status,
    } = req.body;


    // ------------------------------------
    // Validation
    // ------------------------------------

    if (!name || !name.trim()) {

      return res.status(400).json({
        message: "Trainer name is required",
      });

    }


    // ------------------------------------
    // Update Trainer
    // ------------------------------------

    const updateResult =
      await pool.query(
        `
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
        RETURNING id
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
          id,
        ]
      );


    // ------------------------------------
    // Trainer Not Found
    // ------------------------------------

    if (
      updateResult.rows.length === 0
    ) {

      return res.status(404).json({
        message: "Trainer not found",
      });

    }


    // ------------------------------------
    // Return Updated Trainer
    // ------------------------------------

    const result =
      await pool.query(
        `
        SELECT
          id,
          name,
          gender,
          phone,
          email,
          specialization,
          experience,
          salary,
          hire_date,
          status,
          created_at
        FROM trainers
        WHERE id = $1
        `,
        [id]
      );


    res.status(200).json(
      result.rows[0]
    );

  } catch (error) {

    console.error(
      "Update trainer error:",
      error
    );


    // Duplicate email
    if (error.code === "23505") {

      return res.status(409).json({
        message:
          "A trainer with this email already exists",
      });

    }


    res.status(500).json({
      message: "Failed to update trainer",
      error: error.message,
    });

  }
};


// ========================================
// DELETE TRAINER
// ========================================

const deleteTrainer = async (req, res) => {

  try {

    const { id } = req.params;


    const result = await pool.query(
      `
      DELETE FROM trainers
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );


    // ------------------------------------
    // Trainer Not Found
    // ------------------------------------

    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "Trainer not found",
      });

    }


    res.status(200).json({

      message:
        "Trainer deleted successfully",

      id: result.rows[0].id,

    });

  } catch (error) {

    console.error(
      "Delete trainer error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete trainer",
      error: error.message,
    });

  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {

  getTrainers,

  getTrainerById,

  createTrainer,

  updateTrainer,

  deleteTrainer,

};