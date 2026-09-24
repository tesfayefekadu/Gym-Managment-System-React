import API_URL, {
  handleResponse,
  authHeaders,
} from "./api";

// ========================================
// GET ALL ATTENDANCE
// ========================================

export const getAttendance = async () => {
  const response = await fetch(`${API_URL}/attendance`, {
    headers: authHeaders(),
  });

  return await handleResponse(response);
};

// ========================================
// GET SINGLE ATTENDANCE
// ========================================

export const getAttendanceById = async (id) => {
  const response = await fetch(`${API_URL}/attendance/${id}`, {
    headers: authHeaders(),
  });

  return await handleResponse(response);
};

// ========================================
// CREATE ATTENDANCE
// ========================================

export const createAttendance = async (attendanceData) => {
  const response = await fetch(`${API_URL}/attendance`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(attendanceData),
  });

  return await handleResponse(response);
};

// ========================================
// UPDATE ATTENDANCE
// ========================================

export const updateAttendance = async (id, attendanceData) => {
  const response = await fetch(`${API_URL}/attendance/${id}`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify(attendanceData),
  });

  return await handleResponse(response);
};

// ========================================
// DELETE ATTENDANCE
// ========================================

export const deleteAttendance = async (id) => {
  const response = await fetch(`${API_URL}/attendance/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return await handleResponse(response);
};