import API_URL, {
  handleResponse,
  authHeaders,
} from "./api";

// ========================================
// GET ALL TRAINERS
// ========================================

export const getTrainers = async () => {
  const response = await fetch(`${API_URL}/trainers`, {
    headers: authHeaders(),
  });

  return await handleResponse(response);
};

// ========================================
// GET SINGLE TRAINER
// ========================================

export const getTrainerById = async (id) => {
  const response = await fetch(`${API_URL}/trainers/${id}`, {
    headers: authHeaders(),
  });

  return await handleResponse(response);
};

// ========================================
// CREATE TRAINER
// ========================================

export const createTrainer = async (trainerData) => {
  const response = await fetch(`${API_URL}/trainers`, {
    method: "POST",
    headers: authHeaders(true),
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
    headers: authHeaders(true),
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
    headers: authHeaders(),
  });

  return await handleResponse(response);
};