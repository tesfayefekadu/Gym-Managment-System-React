const API_URL = "http://localhost:5000/api/woredas";

// GET ALL WOREDAS
export const getWoredas = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch Woredas");
  }

  return data;
};

// GET WOREDA BY ID
export const getWoredaById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch Woreda");
  }

  return data;
};

// CREATE WOREDA
export const createWoreda = async (woredaData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(woredaData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create Woreda");
  }

  return data;
};

// UPDATE WOREDA
export const updateWoreda = async (id, woredaData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(woredaData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update Woreda");
  }

  return data;
};