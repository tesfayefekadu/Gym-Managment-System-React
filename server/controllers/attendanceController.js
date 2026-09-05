const pool = require("../config/db");

// ========================================
// GET ALL ATTENDANCE
// ========================================
const getAttendance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.member_id,
        m.name AS member_name,
        m.phone AS member_phone,
        TO_CHAR(a.attendance_date, 'YYYY-MM-DD') AS attendance_date,
        TO_CHAR(a.check_in, 'HH24:MI') AS check_in,
        TO_CHAR(a.check_out, 'HH24:MI') AS check_out,
        a.status,
        a.created_at
      FROM attendance a
      INNER JOIN members m
        ON a.member_id = m.id
      ORDER BY a.attendance_date DESC, a.id DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get attendance error:", error);

    res.status(500).json({
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// ========================================
// GET ATTENDANCE BY ID
// ========================================
const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.member_id,
        m.name AS member_name,
        m.phone AS member_phone,
        a.attendance_date,
        a.check_in,
        a.check_out,
        a.status,
        a.created_at
      FROM attendance a
      INNER JOIN members m
        ON a.member_id = m.id
      WHERE a.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get attendance error:", error);

    res.status(500).json({
      message: "Failed to fetch attendance record",
      error: error.message,
    });
  }
};

// ========================================
// CREATE ATTENDANCE
// ========================================
const createAttendance = async (req, res) => {
  try {
    const {
      member_id,
      attendance_date,
      check_in,
      check_out,
      status,
    } = req.body;

    // Validate member
    if (!member_id) {
      return res.status(400).json({
        message: "Member is required",
      });
    }

    // Validate status
    const validStatuses = ["Present", "Absent", "Late"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be Present, Absent, or Late",
      });
    }

    // Check whether member exists
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

    // Insert attendance
    const insertResult = await pool.query(
      `
      INSERT INTO attendance (
        member_id,
        attendance_date,
        check_in,
        check_out,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        member_id,
        attendance_date || null,
        check_in || null,
        check_out || null,
        status,
      ]
    );

    const attendanceId = insertResult.rows[0].id;

    // Return complete record
    const result = await pool.query(
      `
      SELECT
        a.id,
        a.member_id,
        m.name AS member_name,
        m.phone AS member_phone,
        a.attendance_date,
        a.check_in,
        a.check_out,
        a.status,
        a.created_at
      FROM attendance a
      INNER JOIN members m
        ON a.member_id = m.id
      WHERE a.id = $1
      `,
      [attendanceId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create attendance error:", error);

    // Duplicate member/date
    if (error.code === "23505") {
      return res.status(409).json({
        message:
          "This member already has an attendance record for this date",
      });
    }

    res.status(500).json({
      message: "Failed to create attendance",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE ATTENDANCE
// ========================================
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      member_id,
      attendance_date,
      check_in,
      check_out,
      status,
    } = req.body;

    // Validate member
    if (!member_id) {
      return res.status(400).json({
        message: "Member is required",
      });
    }

    // Validate status
    const validStatuses = ["Present", "Absent", "Late"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be Present, Absent, or Late",
      });
    }

    // Check whether member exists
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

    // Update attendance
    const updateResult = await pool.query(
      `
      UPDATE attendance
      SET
        member_id = $1,
        attendance_date = $2,
        check_in = $3,
        check_out = $4,
        status = $5
      WHERE id = $6
      RETURNING id
      `,
      [
        member_id,
        attendance_date,
        check_in || null,
        check_out || null,
        status,
        id,
      ]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }
    

    // Return updated record
    const result = await pool.query(
  `
  SELECT
    a.id,
    a.member_id,
    m.name AS member_name,
    m.phone AS member_phone,
    TO_CHAR(a.attendance_date, 'YYYY-MM-DD') AS attendance_date,
    TO_CHAR(a.check_in, 'HH24:MI') AS check_in,
    TO_CHAR(a.check_out, 'HH24:MI') AS check_out,
    a.status,
    a.created_at
  FROM attendance a
  INNER JOIN members m
    ON a.member_id = m.id
  WHERE a.id = $1
  `,
  [id]
);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update attendance error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message:
          "This member already has an attendance record for this date",
      });
    }

    res.status(500).json({
      message: "Failed to update attendance",
      error: error.message,
    });
  }
};

// ========================================
// DELETE ATTENDANCE
// ========================================
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM attendance
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Delete attendance error:", error);

    res.status(500).json({
      message: "Failed to delete attendance",
      error: error.message,
    });
  }
};

module.exports = {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};