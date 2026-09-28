const userService = require("../services/userService");

// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();

    res.json(users);
  } catch (error) {
    console.error("Failed to get users:", error);

    res.status(500).json({
      message: "Failed to get users",
    });
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

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

module.exports = {
  getUsers,
  getUserById,
};