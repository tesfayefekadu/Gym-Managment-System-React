const pool = require("../config/db");


// CREATE USER
const createUser = async (name, email, passwordHash, role = "Staff") => {
  const result = await pool.query(
    `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        name,
        email,
        role,
        status,
        created_at,
        updated_at
    `,
    [name, email, passwordHash, role]
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