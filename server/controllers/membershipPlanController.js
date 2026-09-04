const pool = require("../config/db");

// ==========================
// GET ALL MEMBERSHIP PLANS
// ==========================

const getMembershipPlans = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
  mp.id,
  mp.name,
  mp.duration_months,
  mp.price,
  mp.description,
  mp.status,
  mp.created_at,
  COUNT(m.id)::integer AS members
FROM membership_plans mp
LEFT JOIN members m
  ON m.plan_id = mp.id
GROUP BY
  mp.id,
  mp.name,
  mp.duration_months,
  mp.price,
  mp.description,
  mp.status,
  mp.created_at
ORDER BY mp.id DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(
      "Get membership plans error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch membership plans",
      error: error.message,
    });
  }
};

// ==========================
// GET SINGLE MEMBERSHIP PLAN
// ==========================

const getMembershipPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
  mp.id,
  mp.name,
  mp.duration_months,
  mp.price,
  mp.description,
  mp.status,
  mp.created_at,
  COUNT(m.id)::integer AS members
FROM membership_plans mp
LEFT JOIN members m
  ON m.plan_id = mp.id
WHERE mp.id = $1
GROUP BY
  mp.id,
  mp.name,
  mp.duration_months,
  mp.price,
  mp.description,
  mp.status,
  mp.created_at
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Membership plan not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(
      "Get membership plan error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch membership plan",
      error: error.message,
    });
  }
};

// ==========================
// CREATE MEMBERSHIP PLAN
// ==========================

const createMembershipPlan = async (req, res) => {
  try {
    const {
      name,
      duration_months,
      price,
      description,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Membership plan name is required",
      });
    }

    if (
      duration_months === undefined ||
      duration_months === null ||
      Number(duration_months) <= 0
    ) {
      return res.status(400).json({
        message: "Duration must be greater than 0",
      });
    }

    if (
      price === undefined ||
      price === null ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "Price must be greater than or equal to 0",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO membership_plans (
        name,
        duration_months,
        price,
        description,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        name.trim(),
        Number(duration_months),
        Number(price),
        description || null,
        status || "Active",
      ]
    );

    const planId = result.rows[0].id;

    const planResult = await pool.query(
      `
      SELECT
        id,
        name,
        duration_months,
        price,
        description,
        status,
        created_at
      FROM membership_plans
      WHERE id = $1
      `,
      [planId]
    );

    res.status(201).json(planResult.rows[0]);
  } catch (error) {
    console.error(
      "Create membership plan error:",
      error
    );

    // PostgreSQL UNIQUE violation
    if (error.code === "23505") {
      return res.status(409).json({
        message:
          "A membership plan with this name already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create membership plan",
      error: error.message,
    });
  }
};

// ==========================
// UPDATE MEMBERSHIP PLAN
// ==========================

const updateMembershipPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      duration_months,
      price,
      description,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Membership plan name is required",
      });
    }

    if (
      duration_months === undefined ||
      duration_months === null ||
      Number(duration_months) <= 0
    ) {
      return res.status(400).json({
        message: "Duration must be greater than 0",
      });
    }

    if (
      price === undefined ||
      price === null ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "Price must be greater than or equal to 0",
      });
    }

    const updateResult = await pool.query(
      `
      UPDATE membership_plans
      SET
        name = $1,
        duration_months = $2,
        price = $3,
        description = $4,
        status = $5
      WHERE id = $6
      RETURNING id
      `,
      [
        name.trim(),
        Number(duration_months),
        Number(price),
        description || null,
        status || "Active",
        id,
      ]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        message: "Membership plan not found",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        duration_months,
        price,
        description,
        status,
        created_at
      FROM membership_plans
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(
      "Update membership plan error:",
      error
    );

    if (error.code === "23505") {
      return res.status(409).json({
        message:
          "A membership plan with this name already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update membership plan",
      error: error.message,
    });
  }
};

// ==========================
// DELETE MEMBERSHIP PLAN
// ==========================

const deleteMembershipPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM membership_plans
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Membership plan not found",
      });
    }

    res.status(200).json({
      message: "Membership plan deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error(
      "Delete membership plan error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete membership plan",
      error: error.message,
    });
  }
};

module.exports = {
  getMembershipPlans,
  getMembershipPlanById,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
};