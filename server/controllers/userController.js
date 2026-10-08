const bcrypt = require("bcrypt");
const userService = require("../services/userService");
const getWoredaScope = require("../utils/woredaScope");
const woredaService = require("../services/woredaService");

// GET ALL USERS
// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const woredaId = getWoredaScope(req);

    const users = await userService.getUsers(woredaId);

    res.json(users);
  } catch (error) {
    console.error("Failed to get users:", error);

    res.status(500).json({
      message: "Failed to get users",
    });
  }
};

// GET USER BY ID
// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const woredaId = getWoredaScope(req);

    const user = await userService.getUserById(
      req.params.id,
      woredaId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Failed to get user:", error);

    res.status(500).json({
      message: "Failed to get user",
    });
  }
};

// ========================================
// CREATE MANAGED USER
// ========================================
const createManagedUser = async (req, res) => {
  try {
    const { name, email, password, role, woreda_id } = req.body;

    // ========================================
    // BASIC VALIDATION
    // ========================================
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    if (!["Manager", "Staff"].includes(role)) {
      return res.status(400).json({
        message: "Only Manager or Staff accounts can be created",
      });
    }

    // ========================================
    // CHECK DUPLICATE EMAIL
    // ========================================
    const existingUser = await userService.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // ========================================
    // DETERMINE WOR​EDA
    // ========================================
let finalWoredaId;

if (req.user.role === "Admin") {
  // Admin can create Manager only
  if (role !== "Manager") {
    return res.status(403).json({
      message: "Admin can only create Manager accounts",
    });
  }

  // Woreda is required
  if (!woreda_id) {
    return res.status(400).json({
      message: "Woreda is required when creating a Manager",
    });
  }

  // Make sure selected Woreda exists AND is Active
  const activeWoreda =
    await woredaService.getActiveWoredaById(woreda_id);

  if (!activeWoreda) {
    return res.status(400).json({
      message: "Selected Woreda does not exist or is inactive",
    });
  }

  finalWoredaId = activeWoreda.id;
} else if (req.user.role === "Manager") {
  // Manager can create Staff only
  if (role !== "Staff") {
    return res.status(403).json({
      message: "Manager can only create Staff accounts",
    });
  }

  // Manager cannot choose Woreda
  if (woreda_id !== undefined) {
    return res.status(400).json({
      message: "Manager cannot assign a Woreda",
    });
  }

  finalWoredaId = getWoredaScope(req);

  if (!finalWoredaId) {
    return res.status(403).json({
      message: "Manager is not assigned to a Woreda",
    });
  }

  // Make sure Manager's Woreda is still Active
  const activeWoreda =
    await woredaService.getActiveWoredaById(finalWoredaId);

  if (!activeWoreda) {
    return res.status(403).json({
      message: "Your Woreda is inactive",
    });
  }
} else {
  return res.status(403).json({
    message: "You are not authorized to create users",
  });
}

    // ========================================
    // HASH PASSWORD
    // ========================================
    const passwordHash = await bcrypt.hash(password, 10);

    // ========================================
    // CREATE USER
    // ========================================
    const user = await userService.createManagedUser(
      name.trim(),
      email.trim().toLowerCase(),
      passwordHash,
      role,
      finalWoredaId
    );

    res.status(201).json({
      message: `${role} account created successfully`,
      user,
    });
  } catch (error) {
    console.error("Failed to create managed user:", error);

    // PostgreSQL duplicate error
    if (error.code === "23505") {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // PostgreSQL foreign key error
    if (error.code === "23503") {
      return res.status(400).json({
        message: "Selected Woreda does not exist",
      });
    }

    res.status(500).json({
      message: "Failed to create user",
    });
  }
};
module.exports = {
  getUsers,
  getUserById,
  createManagedUser
};