const API_URL =
  `${import.meta.env.VITE_API_URL}/api/membership-plans`;

// ==========================
// HANDLE API RESPONSE
// ==========================

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

// ==========================
// GET ALL MEMBERSHIP PLANS
// ==========================

export const getMembershipPlans = async () => {
  const response = await fetch(API_URL);

  return await handleResponse(response);
};

// ==========================
// GET SINGLE MEMBERSHIP PLAN
// ==========================

export const getMembershipPlanById = async (id) => {
  const response = await fetch(
    `${API_URL}/${id}`
  );

  return await handleResponse(response);
};

// ==========================
// CREATE MEMBERSHIP PLAN
// ==========================

export const createMembershipPlan = async (
  planData
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(planData),
  });

  return await handleResponse(response);
};

// ==========================
// UPDATE MEMBERSHIP PLAN
// ==========================

export const updateMembershipPlan = async (
  id,
  planData
) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    }
  );

  return await handleResponse(response);
};

// ==========================
// DELETE MEMBERSHIP PLAN
// ==========================

export const deleteMembershipPlan = async (id) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  return await handleResponse(response);
};