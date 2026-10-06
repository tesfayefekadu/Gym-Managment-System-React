const pool = require("../config/db");


// CREATE USER
// CREATE USER
const createUser = async (
  name,
  email,
  passwordHash,
  role = "Staff",
  woreda_id = null
) => {
  const result = await pool.query(
    `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role,
        woreda_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        email,
        role,
        status,
        woreda_id,
        created_at,
        updated_at
    `,
    [name, email, passwordHash, role, woreda_id]
  );

  return result.rows[0];
};

// GET ALL USERS
const getUsers = async () => {
  const result = await pool.query(`
    SELECT
      id,
      name,
      email,
      role,
      status,
      woreda_id,
      created_at,
      updated_at
    FROM users
    ORDER BY id DESC
  `);

  return result.rows;
};

// GET USER BY ID
const getUserById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        role,
        status,
        woreda_id,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// GET USER BY EMAIL
const getUserByEmail = async (email) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        password_hash,
        role,
        status,
        woreda_id,
        created_at,
        updated_at
      FROM users
      WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
};