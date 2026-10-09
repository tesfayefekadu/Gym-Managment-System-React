const pool = require("../config/db");

// GET ALL WOREDAS
const getWoredas = async () => {
  const result = await pool.query(`
    SELECT
      id,
      name,
      code,
      status,
      created_at
    FROM woredas
    ORDER BY id ASC
  `);

  return result.rows;
};

// GET WOREDA BY ID
const getWoredaById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        code,
        status,
        created_at
      FROM woredas
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// CREATE WOREDA
const createWoreda = async (name, code) => {
  const result = await pool.query(
    `
      INSERT INTO woredas (
        name,
        code
      )
      VALUES ($1, $2)
      RETURNING
        id,
        name,
        code,
        status,
        created_at
    `,
    [name, code]
  );

  return result.rows[0];
};

// UPDATE WOREDA
const updateWoreda = async (id, name, code, status) => {
  const result = await pool.query(
    `
      UPDATE woredas
      SET
        name = $1,
        code = $2,
        status = $3
      WHERE id = $4
      RETURNING
        id,
        name,
        code,
        status,
        created_at
    `,
    [name, code, status, id]
  );

  return result.rows[0];
};

const getActiveWoredaById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        code,
        status
      FROM woredas
      WHERE id = $1
        AND status = 'Active'
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getWoredas,
  getWoredaById,
  createWoreda,
  updateWoreda,
  getActiveWoredaById 
};