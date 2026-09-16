import API_URL, { handleResponse } from "./api";

// ========================================
// GET ALL ATTENDANCE
// ========================================

export const getAttendance = async () => {
  const response = await fetch(`${API_URL}/attendance`);

  return await handleResponse(response);
};

// ========================================
// GET SINGLE ATTENDANCE
// ========================================

export const getAttendanceById = async (id) => {
  const response = await fetch(
    `${API_URL}/attendance/${id}`
  );

  return await handleResponse(response);
};

// ========================================
// CREATE ATTENDANCE
// ========================================

export const createAttendance = async (attendanceData) => {
  const response = await fetch(
    `${API_URL}/attendance`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(attendanceData),
    }
  );

  return await handleResponse(response);
};

// ========================================
// UPDATE ATTENDANCE
// ========================================

export const updateAttendance = async (
  id,
  attendanceData
) => {
  const response = await fetch(
    `${API_URL}/attendance/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(attendanceData),
    }
  );

  return await handleResponse(response);
};

// ========================================
// DELETE ATTENDANCE
// ========================================

export const deleteAttendance = async (id) => {
  const response = await fetch(
    `${API_URL}/attendance/${id}`,
    {
      method: "DELETE",
    }
  );

  return await handleResponse(response);
};