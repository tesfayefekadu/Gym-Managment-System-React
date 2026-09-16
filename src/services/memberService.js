import API_URL, { handleResponse } from "./api";

// GET ALL MEMBERS
export const getMembers = async () => {
  const response = await fetch(`${API_URL}/members`);
  return await handleResponse(response);
};

// GET MEMBER BY ID
export const getMemberById = async (id) => {
  const response = await fetch(`${API_URL}/members/${id}`);
  return await handleResponse(response);
};

// CREATE MEMBER
export const createMember = async (memberData) => {
  const response = await fetch(`${API_URL}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  });

  return await handleResponse(response);
};

// UPDATE MEMBER
export const updateMember = async (id, memberData) => {
  const response = await fetch(`${API_URL}/members/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  });

  return await handleResponse(response);
};

// DELETE MEMBER
export const deleteMember = async (id) => {
  const response = await fetch(`${API_URL}/members/${id}`, {
    method: "DELETE",
  });

  return await handleResponse(response);
};