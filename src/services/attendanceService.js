const API_URL =
  `${import.meta.env.VITE_API_URL}/api/attendance`;

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
// GET ALL ATTENDANCE
// ========================================
export const getAttendance = async () => {
  const response = await fetch(API_URL);

  return await handleResponse(response);
};

// ========================================
// GET ATTENDANCE BY ID
// ========================================
export const getAttendanceById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  return await handleResponse(response);
};

// ========================================
// CREATE ATTENDANCE
// ========================================
export const createAttendance = async (attendanceData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attendanceData),
  });

  return await handleResponse(response);
};

// ========================================
// UPDATE ATTENDANCE
// ========================================
export const updateAttendance = async (id, attendanceData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attendanceData),
  });

  return await handleResponse(response);
};

// ========================================
// DELETE ATTENDANCE
// ========================================
export const deleteAttendance = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return await handleResponse(response);
};