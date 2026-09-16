import API_URL, { handleResponse } from "./api";

// ========================================
// GET ALL MEMBERSHIP PLANS
// ========================================

export const getMembershipPlans = async () => {
  const response = await fetch(`${API_URL}/membership-plans`);

  return await handleResponse(response);
};

// ========================================
// GET SINGLE MEMBERSHIP PLAN
// ========================================

export const getMembershipPlanById = async (id) => {
  const response = await fetch(
    `${API_URL}/membership-plans/${id}`
  );

  return await handleResponse(response);
};

// ========================================
// CREATE MEMBERSHIP PLAN
// ========================================

export const createMembershipPlan = async (planData) => {
  const response = await fetch(
    `${API_URL}/membership-plans`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(planData),
    }
  );

  return await handleResponse(response);
};

// ========================================
// UPDATE MEMBERSHIP PLAN
// ========================================

export const updateMembershipPlan = async (
  id,
  planData
) => {
  const response = await fetch(
    `${API_URL}/membership-plans/${id}`,
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

// ========================================
// DELETE MEMBERSHIP PLAN
// ========================================

export const deleteMembershipPlan = async (id) => {
  const response = await fetch(
    `${API_URL}/membership-plans/${id}`,
    {
      method: "DELETE",
    }
  );

  return await handleResponse(response);
};