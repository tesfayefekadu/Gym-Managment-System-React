import { useEffect, useState, useCallback } from "react";

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

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMembershipPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch membership plans error:", error);
      setError(error.message || "Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const addPlan = async (planData) => {
    try {
      setError("");

      const data = await createMembershipPlan(planData);
      const newPlan = data.plan ?? data;

      setPlans((previousPlans) => [newPlan, ...previousPlans]);

      return newPlan;
    } catch (error) {
      setError(error.message || "Failed to add membership plan");
      throw error;
    }
  };

  const updatePlan = async (id, planData) => {
    try {
      setError("");

      const data = await updateMembershipPlanApi(id, planData);
      const updatedPlan = data.plan ?? data;

      setPlans((previousPlans) =>
        previousPlans.map((plan) =>
          String(plan.id) === String(id) ? updatedPlan : plan
        )
      );

      return updatedPlan;
    } catch (error) {
      setError(error.message || "Failed to update membership plan");
      throw error;
    }
  };

  const deletePlan = async (id) => {
    try {
      setError("");

      await deleteMembershipPlanApi(id);

      setPlans((previousPlans) =>
        previousPlans.filter(
          (plan) => String(plan.id) !== String(id)
        )
      );
    } catch (error) {
      setError(error.message || "Failed to delete membership plan");
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