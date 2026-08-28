const API_URL = "http://localhost:5000/api/members";


// ========================================
// HELPER: HANDLE API RESPONSE
// ========================================
const handleResponse = async (response) => {
  let data = null;

  // Try to read JSON response
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  // API returned an error
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
// GET ALL MEMBERS
// ========================================
export const getMembers = async () => {

  try {

    const response = await fetch(API_URL);

    return await handleResponse(response);

  } catch (error) {

    console.error(
      "Get members error:",
      error
    );

    throw new Error(
      error.message ||
      "Unable to fetch members"
    );
  }
};


// ========================================
// GET SINGLE MEMBER
// ========================================
export const getMemberById = async (id) => {

  try {

    const response = await fetch(
      `${API_URL}/${id}`
    );

    return await handleResponse(response);

  } catch (error) {

    console.error(
      "Get member error:",
      error
    );

    throw new Error(
      error.message ||
      "Unable to fetch member"
    );
  }
};


// ========================================
// CREATE MEMBER
// ========================================
export const createMember = async (
  memberData
) => {

  try {

    const response = await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(memberData),
      }
    );

    return await handleResponse(
      response
    );

  } catch (error) {

    console.error(
      "Create member error:",
      error
    );

    throw new Error(
      error.message ||
      "Unable to create member"
    );
  }
};


// ========================================
// UPDATE MEMBER
// ========================================
export const updateMember = async (
  id,
  memberData
) => {

  try {

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(memberData),
      }
    );

    return await handleResponse(
      response
    );

  } catch (error) {

    console.error(
      "Update member error:",
      error
    );

    throw new Error(
      error.message ||
      "Unable to update member"
    );
  }
};


// ========================================
// DELETE MEMBER
// ========================================
export const deleteMember = async (
  id
) => {

  try {

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
      }
    );

    return await handleResponse(
      response
    );

  } catch (error) {

    console.error(
      "Delete member error:",
      error
    );

    throw new Error(
      error.message ||
      "Unable to delete member"
    );
  }
};