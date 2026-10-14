
const pool = require("../config/db");

// ========================================
// HELPERS
// ========================================

const getWoredaId = (req) => {
  if (req.user.role === "Admin") {
    return null;
  }

  return req.user.woreda_id;
};

const validatePlanFields = ({ name, duration_months, price }) => {
  if (
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isInteger(Number(duration_months)) ||
    Number(duration_months) <= 0 ||
    price === undefined ||
    price === null ||
    price === "" ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0
  ) {
    return "Name, a positive duration, and a non-negative price are required";
  }

  return null;
};

const validateWoreda = async (woredaId) => {
  if (
    woredaId === undefined ||
    woredaId === null ||
    woredaId === "" ||
    !Number.isInteger(Number(woredaId)) ||
    Number(woredaId) <= 0
  ) {
    return false;
  }

  const result = await pool.query(
    "SELECT id FROM woredas WHERE id = $1",
    [Number(woredaId)]
  );

  return result.rowCount > 0;
};

// ========================================
// GET ALL MEMBERSHIP PLANS
// Admin: all Woredas
// Manager/Staff: assigned Woreda only
// ========================================

const getMembershipPlans = async (req, res) => {
  try {
    const woredaId = getWoredaId(req);

    if (req.user.role !== "Admin" && !woredaId) {
      return res.status(403).json({
        message: "User is not assigned to a Woreda",
      });
    }

    let query = `
      SELECT
        mp.id,
        mp.name,
        mp.duration_months,
        mp.price,
        mp.description,
        mp.status,
        mp.woreda_id,
        COUNT(m.id)::integer AS members
      FROM membership_plans mp
      LEFT JOIN members m
        ON m.plan_id = mp.id
        AND m.woreda_id = mp.woreda_id
    `;

    const values = [];

    if (req.user.role !== "Admin") {
      query += " WHERE mp.woreda_id = $1";
      values.push(woredaId);
    }

    query += `
      GROUP BY
        mp.id,
        mp.name,
        mp.duration_months,
        mp.price,
        mp.description,
        mp.status,
        mp.woreda_id
      ORDER BY mp.id DESC
    `;

    const result = await pool.query(query, values);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get membership plans error:", error);

    return res.status(500).json({
      message: "Failed to retrieve membership plans",
    });
  }
};

// ========================================
// GET MEMBERSHIP PLAN BY ID
// ========================================

const getMembershipPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const woredaId = getWoredaId(req);

    if (req.user.role !== "Admin" && !woredaId) {
      return res.status(403).json({
        message: "User is not assigned to a Woreda",
      });
    }

    let query = `
      SELECT
        mp.id,
        mp.name,
        mp.duration_months,
        mp.price,
        mp.description,
        mp.status,
        mp.woreda_id,
        COUNT(m.id)::integer AS members
      FROM membership_plans mp
      LEFT JOIN members m
        ON m.plan_id = mp.id
        AND m.woreda_id = mp.woreda_id
      WHERE mp.id = $1
    `;

    const values = [id];

    if (req.user.role !== "Admin") {
      query += " AND mp.woreda_id = $2";
      values.push(woredaId);
    }

    query += `
      GROUP BY
        mp.id,
        mp.name,
        mp.duration_months,
        mp.price,
        mp.description,
        mp.status,
        mp.woreda_id
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Membership plan not found",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get membership plan error:", error);

    return res.status(500).json({
      message: "Failed to retrieve membership plan",
    });
  }
};

// ========================================
// CREATE MEMBERSHIP PLAN
// Admin: chooses a Woreda
// Manager: automatically uses assigned Woreda
// ========================================

const createMembershipPlan = async (req, res) => {
  try {
    const {
      name,
      duration_months,
      price,
      description,
      status,
    } = req.body;

    const validationError = validatePlanFields({
      name,
      duration_months,
      price,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    let woredaId;

    if (req.user.role === "Admin") {
      woredaId = req.body.woreda_id;

      if (!(await validateWoreda(woredaId))) {
        return res.status(400).json({
          message: "A valid Woreda must be selected",
        });
      }

      woredaId = Number(woredaId);
    } else {
      woredaId = req.user.woreda_id;

      if (!woredaId) {
        return res.status(403).json({
          message: "User is not assigned to a Woreda",
        });
      }
    }

    const result = await pool.query(
      `
        INSERT INTO membership_plans (
          name,
          duration_months,
          price,
          description,
          status,
          woreda_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          name,
          duration_months,
          price,
          description,
          status,
          woreda_id
      `,
      [
        name.trim(),
        Number(duration_months),
        Number(price),
        description || "",
        status || "Active",
        woredaId,
      ]
    );

    return res.status(201).json({
      message: "Membership plan created successfully",
      plan: {
        ...result.rows[0],
        members: 0,
      },
    });
  } catch (error) {
    console.error("Create membership plan error:", error);

    return res.status(500).json({
      message: "Failed to create membership plan",
    });
  }
};

// ========================================
// UPDATE MEMBERSHIP PLAN
// Admin: any Woreda
// Manager: assigned Woreda only
// Woreda ownership cannot be changed here.
// ========================================

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

    const validationError = validatePlanFields({
      name,
      duration_months,
      price,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const woredaId = getWoredaId(req);

    if (req.user.role !== "Admin" && !woredaId) {
      return res.status(403).json({
        message: "User is not assigned to a Woreda",
      });
    }

    let query = `
      UPDATE membership_plans
      SET
        name = $1,
        duration_months = $2,
        price = $3,
        description = $4,
        status = $5
      WHERE id = $6
    `;

    const values = [
      name.trim(),
      Number(duration_months),
      Number(price),
      description || "",
      status || "Active",
      id,
    ];

    if (req.user.role !== "Admin") {
      query += " AND woreda_id = $7";
      values.push(woredaId);
    }

    query += `
      RETURNING
        id,
        name,
        duration_months,
        price,
        description,
        status,
        woreda_id
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Membership plan not found",
      });
    }

    const plan = result.rows[0];

    const countResult = await pool.query(
      `
        SELECT COUNT(*)::integer AS members
        FROM members
        WHERE plan_id = $1
          AND woreda_id = $2
      `,
      [plan.id, plan.woreda_id]
    );

    return res.status(200).json({
      message: "Membership plan updated successfully",
      plan: {
        ...plan,
        members: countResult.rows[0].members,
      },
    });
  } catch (error) {
    console.error("Update membership plan error:", error);

    return res.status(500).json({
      message: "Failed to update membership plan",
    });
  }
};

// ========================================
// DELETE MEMBERSHIP PLAN
// Admin: any Woreda
// Manager: assigned Woreda only
// ========================================

const deleteMembershipPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const woredaId = getWoredaId(req);

    if (req.user.role !== "Admin" && !woredaId) {
      return res.status(403).json({
        message: "User is not assigned to a Woreda",
      });
    }

    let query = "DELETE FROM membership_plans WHERE id = $1";
    const values = [id];

    if (req.user.role !== "Admin") {
      query += " AND woreda_id = $2";
      values.push(woredaId);
    }

    query += " RETURNING id";

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Membership plan not found",
      });
    }

    return res.status(200).json({
      message: "Membership plan deleted successfully",
    });
  } catch (error) {
    console.error("Delete membership plan error:", error);

    if (error.code === "23503") {
      return res.status(409).json({
        message:
          "This plan is linked to existing records and cannot be deleted.",
      });
    }

    return res.status(500).json({
      message: "Failed to delete membership plan",
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
