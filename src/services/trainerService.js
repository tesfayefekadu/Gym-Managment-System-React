const API_URL =
  `${import.meta.env.VITE_API_URL}/api/trainers`;


// ========================================
// HANDLE API RESPONSE
// ========================================

const handleResponse = async (response) => {

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {

    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
};


// ========================================
// GET ALL TRAINERS
// ========================================

export const getTrainers = async () => {

  const response = await fetch(API_URL);

  return await handleResponse(response);
};


// ========================================
// GET SINGLE TRAINER
// ========================================

export const getTrainerById = async (id) => {

  const response = await fetch(
    `${API_URL}/${id}`
  );

  return await handleResponse(response);
};


// ========================================
// CREATE TRAINER
// ========================================

export const createTrainer = async (
  trainerData
) => {

  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(trainerData),
    }
  );

  return await handleResponse(response);
};


// ========================================
// UPDATE TRAINER
// ========================================

export const updateTrainer = async (
  id,
  trainerData
) => {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(trainerData),
    }
  );

  return await handleResponse(response);
};


// ========================================
// DELETE TRAINER
// ========================================

export const deleteTrainer = async (id) => {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  return await handleResponse(response);
};