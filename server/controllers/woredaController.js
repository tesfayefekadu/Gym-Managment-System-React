const woredaService = require("../services/woredaService");

// GET ALL WOREDAS
const getWoredas = async (req, res) => {
  try {
    const woredas = await woredaService.getWoredas();

    res.status(200).json(woredas);
  } catch (error) {
    console.error("Failed to get Woredas:", error);

    res.status(500).json({
      message: "Failed to get Woredas",
    });
  }
};

// GET WOREDA BY ID
const getWoredaById = async (req, res) => {
  try {
    const woreda = await woredaService.getWoredaById(req.params.id);

    if (!woreda) {
      return res.status(404).json({
        message: "Woreda not found",
      });
    }

    res.status(200).json(woreda);
  } catch (error) {
    console.error("Failed to get Woreda:", error);

    res.status(500).json({
      message: "Failed to get Woreda",
    });
  }
};

// CREATE WOREDA
const createWoreda = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message: "Woreda name and code are required",
      });
    }

    const woreda = await woredaService.createWoreda(
      name.trim(),
      code.trim().toUpperCase()
    );

    res.status(201).json({
      message: "Woreda created successfully",
      woreda,
    });
  } catch (error) {
    console.error("Failed to create Woreda:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Woreda name or code already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create Woreda",
    });
  }
};

// UPDATE WOREDA
const updateWoreda = async (req, res) => {
  try {
    const { name, code, status } = req.body;

    if (!name || !code || !status) {
      return res.status(400).json({
        message: "Name, code and status are required",
      });
    }

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Active or Inactive",
      });
    }

    const woreda = await woredaService.updateWoreda(
      req.params.id,
      name.trim(),
      code.trim().toUpperCase(),
      status
    );

    if (!woreda) {
      return res.status(404).json({
        message: "Woreda not found",
      });
    }

    res.status(200).json({
      message: "Woreda updated successfully",
      woreda,
    });
  } catch (error) {
    console.error("Failed to update Woreda:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Woreda name or code already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update Woreda",
    });
  }
};

module.exports = {
  getWoredas,
  getWoredaById,
  createWoreda,
  updateWoreda,
};