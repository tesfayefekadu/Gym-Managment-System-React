import { useEffect, useState } from "react";

import {
  getMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan as updateMembershipPlanApi,
  deleteMembershipPlan as deleteMembershipPlanApi,
} from "../services/membershipPlanService";

function useMembershipPlans() {
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // GET MEMBERSHIP PLANS
  // ==========================

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMembershipPlans();

      setPlans(data);
    } catch (error) {
      console.error(
        "Failed to fetch membership plans:",
        error
      );

      setError(
        error.message ||
          "Failed to load membership plans"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOAD ON COMPONENT MOUNT
  // ==========================

  useEffect(() => {
    fetchPlans();
  }, []);

  // ==========================
  // ADD PLAN
  // ==========================

  const addPlan = async (planData) => {
    try {
      setError("");

      const newPlan =
        await createMembershipPlan(planData);

      setPlans((prev) => [
        newPlan,
        ...prev,
      ]);

      return newPlan;
    } catch (error) {
      console.error(
        "Failed to add membership plan:",
        error
      );

      setError(
        error.message ||
          "Failed to add membership plan"
      );

      throw error;
    }
  };

  // ==========================
  // UPDATE PLAN
  // ==========================

  const updatePlan = async (
    id,
    planData
  ) => {
    try {
      setError("");

      const updatedPlan =
        await updateMembershipPlanApi(
          id,
          planData
        );

      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === id
            ? updatedPlan
            : plan
        )
      );

      return updatedPlan;
    } catch (error) {
      console.error(
        "Failed to update membership plan:",
        error
      );

      setError(
        error.message ||
          "Failed to update membership plan"
      );

      throw error;
    }
  };

  // ==========================
  // DELETE PLAN
  // ==========================

  const deletePlan = async (id) => {
    try {
      setError("");

      await deleteMembershipPlanApi(id);

      setPlans((prev) =>
        prev.filter(
          (plan) => plan.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete membership plan:",
        error
      );

      setError(
        error.message ||
          "Failed to delete membership plan"
      );

      throw error;
    }
  };

  return {
    plans,
    setPlans,

    loading,
    error,

    fetchPlans,

    addPlan,
    updatePlan,
    deletePlan,
  };
}

export default useMembershipPlans;