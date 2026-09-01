const pool = require("../config/db");

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Validate member ID
const isValidId = (id) => {
  return Number.isInteger(Number(id)) && Number(id) > 0;
};


// Validate email
const isValidEmail = (email) => {
  if (!email) return true;

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};


// Validate phone
const isValidPhone = (phone) => {
  if (!phone) return false;

  const phoneRegex =
    /^[0-9]{10}$/;

  return phoneRegex.test(phone);
};


// Validate date
const isValidDate = (date) => {
  if (!date) return true;

  const parsedDate =
    new Date(date);

  return !isNaN(parsedDate.getTime());
};


// Validate gender
const isValidGender = (gender) => {
  return ["Male", "Female"].includes(
    gender
  );
};


// Validate status
const isValidStatus = (status) => {
  return [
    "Active",
    "Expired",
    "Inactive",
  ].includes(status);
};


// =====================================================
// GET ALL MEMBERS
// =====================================================

const getMembers = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        m.id,
        m.name,
        m.gender,
        m.phone,
        m.email,
        m.date_of_birth,
        m.plan_id,
        mp.name AS membership_plan,
        m.status,
        m.join_date

      FROM members m

      LEFT JOIN membership_plans mp
        ON m.plan_id = mp.id

      ORDER BY m.id DESC
    `);


    res.status(200).json(
      result.rows
    );

  } catch (error) {

    console.error(
      "Get members error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch members",
    });
  }
};


// =====================================================
// GET SINGLE MEMBER
// =====================================================

const getMemberById = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    // Validate ID
    if (!isValidId(id)) {

      return res.status(400).json({
        message:
          "Invalid member ID",
      });

    }


    const result =
      await pool.query(
        `
        SELECT
          m.id,
          m.name,
          m.gender,
          m.phone,
          m.email,
          m.date_of_birth,
          m.plan_id,
          mp.name AS membership_plan,
          m.status,
          m.join_date

        FROM members m

        LEFT JOIN membership_plans mp
          ON m.plan_id = mp.id

        WHERE m.id = $1
        `,
        [id]
      );


    if (
      result.rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "Member not found",
      });

    }


    res.status(200).json(
      result.rows[0]
    );

  } catch (error) {

    console.error(
      "Get member error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch member",
    });
  }
};


// =====================================================
// CREATE MEMBER
// =====================================================

const createMember = async (
  req,
  res
) => {

  try {

    const {
      name,
      gender,
      phone,
      email,
      date_of_birth,
      plan_id,
      status,
      join_date,
    } = req.body;


    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (
      !name ||
      !name.trim()
    ) {

      return res.status(400).json({
        message:
          "Member name is required",
      });

    }


    if (!phone) {

      return res.status(400).json({
        message:
          "Phone number is required",
      });

    }


    // =================================================
    // NAME VALIDATION
    // =================================================

    if (
      name.trim().length < 2
    ) {

      return res.status(400).json({
        message:
          "Member name must contain at least 2 characters",
      });

    }


    // =================================================
    // PHONE VALIDATION
    // =================================================

    if (!isValidPhone(phone)) {

      return res.status(400).json({
        message:
          "Phone number must contain exactly 10 digits",
      });

    }


    // =================================================
    // EMAIL VALIDATION
    // =================================================

    if (
      email &&
      !isValidEmail(email)
    ) {

      return res.status(400).json({
        message:
          "Please provide a valid email address",
      });

    }


    // =================================================
    // GENDER VALIDATION
    // =================================================

    if (
      gender &&
      !isValidGender(gender)
    ) {

      return res.status(400).json({
        message:
          "Gender must be Male or Female",
      });

    }


    // =================================================
    // STATUS VALIDATION
    // =================================================

    if (
      status &&
      !isValidStatus(status)
    ) {

      return res.status(400).json({
        message:
          "Invalid member status",
      });

    }


    // =================================================
    // DATE VALIDATION
    // =================================================

    if (
      date_of_birth &&
      !isValidDate(date_of_birth)
    ) {

      return res.status(400).json({
        message:
          "Invalid date of birth",
      });

    }


    if (
      join_date &&
      !isValidDate(join_date)
    ) {

      return res.status(400).json({
        message:
          "Invalid join date",
      });

    }


    // =================================================
    // MEMBERSHIP PLAN VALIDATION
    // =================================================

    if (plan_id) {

      const planResult =
        await pool.query(
          `
          SELECT id
          FROM membership_plans
          WHERE id = $1
          `,
          [plan_id]
        );


      if (
        planResult.rows.length === 0
      ) {

        return res.status(400).json({
          message:
            "Selected membership plan does not exist",
        });

      }

    }


    // =================================================
    // DUPLICATE PHONE CHECK
    // =================================================

    const phoneResult =
      await pool.query(
        `
        SELECT id
        FROM members
        WHERE phone = $1
        `,
        [phone]
      );


    if (
      phoneResult.rows.length > 0
    ) {

      return res.status(409).json({
        message:
          "A member with this phone number already exists",
      });

    }


    // =================================================
    // DUPLICATE EMAIL CHECK
    // =================================================

    if (email) {

      const emailResult =
        await pool.query(
          `
          SELECT id
          FROM members
          WHERE LOWER(email) = LOWER($1)
          `,
          [email]
        );


      if (
        emailResult.rows.length > 0
      ) {

        return res.status(409).json({
          message:
            "A member with this email already exists",
        });

      }

    }


    // =================================================
    // INSERT MEMBER
    // =================================================

    const insertResult =
      await pool.query(
        `
        INSERT INTO members (
          name,
          gender,
          phone,
          email,
          date_of_birth,
          plan_id,
          status,
          join_date
        )

        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8
        )

        RETURNING id
        `,
        [
          name.trim(),
          gender || "Male",
          phone,
          email || null,
          date_of_birth || null,
          plan_id || null,
          status || "Active",
          join_date || null,
        ]
      );


    const newMemberId =
      insertResult.rows[0].id;


    // =================================================
    // GET CREATED MEMBER WITH PLAN
    // =================================================

    const result =
      await pool.query(
        `
        SELECT
          m.id,
          m.name,
          m.gender,
          m.phone,
          m.email,
          m.date_of_birth,
          m.plan_id,
          mp.name AS membership_plan,
          m.status,
          m.join_date

        FROM members m

        LEFT JOIN membership_plans mp
          ON m.plan_id = mp.id

        WHERE m.id = $1
        `,
        [newMemberId]
      );


    res.status(201).json(
      result.rows[0]
    );

  } catch (error) {

    console.error(
      "Create member error:",
      error
    );


    // PostgreSQL duplicate error
    if (
      error.code === "23505"
    ) {

      return res.status(409).json({
        message:
          "A member with the same information already exists",
      });

    }


    // PostgreSQL foreign key error
    if (
      error.code === "23503"
    ) {

      return res.status(400).json({
        message:
          "Selected membership plan does not exist",
      });

    }


    res.status(500).json({
      message:
        "Failed to create member",
    });
  }
};


// =====================================================
// UPDATE MEMBER
// =====================================================

const updateMember = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    const {
      name,
      gender,
      phone,
      email,
      date_of_birth,
      plan_id,
      status,
      join_date,
    } = req.body;


    // =================================================
    // ID VALIDATION
    // =================================================

    if (!isValidId(id)) {

      return res.status(400).json({
        message:
          "Invalid member ID",
      });

    }


    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (
      !name ||
      !name.trim()
    ) {

      return res.status(400).json({
        message:
          "Member name is required",
      });

    }


    if (!phone) {

      return res.status(400).json({
        message:
          "Phone number is required",
      });

    }


    // =================================================
    // NAME VALIDATION
    // =================================================

    if (
      name.trim().length < 2
    ) {

      return res.status(400).json({
        message:
          "Member name must contain at least 2 characters",
      });

    }


    // =================================================
    // PHONE VALIDATION
    // =================================================

    if (!isValidPhone(phone)) {

      return res.status(400).json({
        message:
          "Phone number must contain exactly 10 digits",
      });

    }


    // =================================================
    // EMAIL VALIDATION
    // =================================================

    if (
      email &&
      !isValidEmail(email)
    ) {

      return res.status(400).json({
        message:
          "Please provide a valid email address",
      });

    }


    // =================================================
    // GENDER VALIDATION
    // =================================================

    if (
      gender &&
      !isValidGender(gender)
    ) {

      return res.status(400).json({
        message:
          "Gender must be Male or Female",
      });

    }


    // =================================================
    // STATUS VALIDATION
    // =================================================

    if (
      status &&
      !isValidStatus(status)
    ) {

      return res.status(400).json({
        message:
          "Invalid member status",
      });

    }


    // =================================================
    // DATE VALIDATION
    // =================================================

    if (
      date_of_birth &&
      !isValidDate(date_of_birth)
    ) {

      return res.status(400).json({
        message:
          "Invalid date of birth",
      });

    }


    if (
      join_date &&
      !isValidDate(join_date)
    ) {

      return res.status(400).json({
        message:
          "Invalid join date",
      });

    }


    // =================================================
    // CHECK MEMBER EXISTS
    // =================================================

    const memberResult =
      await pool.query(
        `
        SELECT id
        FROM members
        WHERE id = $1
        `,
        [id]
      );


    if (
      memberResult.rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "Member not found",
      });

    }


    // =================================================
    // MEMBERSHIP PLAN VALIDATION
    // =================================================

    if (plan_id) {

      const planResult =
        await pool.query(
          `
          SELECT id
          FROM membership_plans
          WHERE id = $1
          `,
          [plan_id]
        );


      if (
        planResult.rows.length === 0
      ) {

        return res.status(400).json({
          message:
            "Selected membership plan does not exist",
        });

      }

    }


    // =================================================
    // DUPLICATE PHONE CHECK
    // Exclude current member
    // =================================================

    const phoneResult =
      await pool.query(
        `
        SELECT id
        FROM members
        WHERE phone = $1
        AND id <> $2
        `,
        [
          phone,
          id,
        ]
      );


    if (
      phoneResult.rows.length > 0
    ) {

      return res.status(409).json({
        message:
          "Another member already uses this phone number",
      });

    }


    // =================================================
    // DUPLICATE EMAIL CHECK
    // Exclude current member
    // =================================================

    if (email) {

      const emailResult =
        await pool.query(
          `
          SELECT id
          FROM members
          WHERE LOWER(email) = LOWER($1)
          AND id <> $2
          `,
          [
            email,
            id,
          ]
        );


      if (
        emailResult.rows.length > 0
      ) {

        return res.status(409).json({
          message:
            "Another member already uses this email",
        });

      }

    }


    // =================================================
    // UPDATE MEMBER
    // =================================================

    const updateResult =
      await pool.query(
        `
        UPDATE members

        SET
          name = $1,
          gender = $2,
          phone = $3,
          email = $4,
          date_of_birth = $5,
          plan_id = $6,
          status = $7,
          join_date = $8

        WHERE id = $9

        RETURNING id
        `,
        [
          name.trim(),
          gender || "Male",
          phone,
          email || null,
          date_of_birth || null,
          plan_id || null,
          status || "Active",
          join_date || null,
          id,
        ]
      );


    if (
      updateResult.rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "Member not found",
      });

    }


    // =================================================
    // GET UPDATED MEMBER WITH PLAN
    // =================================================

    const result =
      await pool.query(
        `
        SELECT
          m.id,
          m.name,
          m.gender,
          m.phone,
          m.email,
          m.date_of_birth,
          m.plan_id,
          mp.name AS membership_plan,
          m.status,
          m.join_date

        FROM members m

        LEFT JOIN membership_plans mp
          ON m.plan_id = mp.id

        WHERE m.id = $1
        `,
        [id]
      );


    res.status(200).json(
      result.rows[0]
    );

  } catch (error) {

    console.error(
      "Update member error:",
      error
    );


    // PostgreSQL duplicate error
    if (
      error.code === "23505"
    ) {

      return res.status(409).json({
        message:
          "A member with the same information already exists",
      });

    }


    // PostgreSQL foreign key error
    if (
      error.code === "23503"
    ) {

      return res.status(400).json({
        message:
          "Selected membership plan does not exist",
      });

    }


    res.status(500).json({
      message:
        "Failed to update member",
    });
  }
};


// =====================================================
// DELETE MEMBER
// =====================================================

const deleteMember = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    // =================================================
    // ID VALIDATION
    // =================================================

    if (!isValidId(id)) {

      return res.status(400).json({
        message:
          "Invalid member ID",
      });

    }


    // =================================================
    // DELETE
    // =================================================

    const result =
      await pool.query(
        `
        DELETE FROM members

        WHERE id = $1

        RETURNING id
        `,
        [id]
      );


    if (
      result.rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "Member not found",
      });

    }


    res.status(200).json({
      message:
        "Member deleted successfully",

      id:
        result.rows[0].id,
    });

  } catch (error) {

    console.error(
      "Delete member error:",
      error
    );


    // Foreign key restriction
    if (
      error.code === "23503"
    ) {

      return res.status(409).json({
        message:
          "This member cannot be deleted because related records exist",
      });

    }


    res.status(500).json({
      message:
        "Failed to delete member",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  getMembers,

  getMemberById,

  createMember,

  updateMember,

  deleteMember,

};