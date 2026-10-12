import API_URL, { authHeaders, handleResponse } from "./api";

// GET USERS
export const getUsers = async () => {
const response = await fetch(`${API_URL}/users`, {
headers: authHeaders(),
});

return handleResponse(response);
};

// GET USER BY ID
export const getUserById = async (id) => {
const response = await fetch(`${API_URL}/users/${id}`, {
headers: authHeaders(),
});

return handleResponse(response);
};

// CREATE MANAGED USER
// Admin: create a Manager and provide woreda_id.
// Manager: create Staff; the backend assigns their Woreda.
export const createManagedUser = async (userData) => {
const response = await fetch(`${API_URL}/users`, {
method: "POST",
headers: authHeaders(true),
body: JSON.stringify(userData),
});

return handleResponse(response);
};
