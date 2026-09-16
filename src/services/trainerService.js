import API_URL, { handleResponse } from "./api";

// ========================================
// GET ALL TRAINERS
// ========================================

export const getTrainers = async () => {
  const response = await fetch(`${API_URL}/trainers`);

  return await handleResponse(response);
};

// ========================================
// GET SINGLE TRAINER
// ========================================

export const getTrainerById = async (id) => {
  const response = await fetch(`${API_URL}/trainers/${id}`);

  return await handleResponse(response);
};

// ========================================
// CREATE TRAINER
// ========================================

export const createTrainer = async (trainerData) => {
  const response = await fetch(`${API_URL}/trainers`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(trainerData),
  });

  return await handleResponse(response);
};

// ========================================
// UPDATE TRAINER
// ========================================

export const updateTrainer = async (id, trainerData) => {
  const response = await fetch(`${API_URL}/trainers/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(trainerData),
  });

  return await handleResponse(response);
};

// ========================================
// DELETE TRAINER
// ========================================

export const deleteTrainer = async (id) => {
  const response = await fetch(`${API_URL}/trainers/${id}`, {
    method: "DELETE",
  });

  return await handleResponse(response);
};