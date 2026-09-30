import { useCallback, useEffect, useState } from "react";

import { getCurrentUser } from "../services/authService";

import { getMembers } from "../services/memberService";
import { getTrainers } from "../services/trainerService";
import { getMembershipPlans } from "../services/membershipPlanService";
import { getAttendance } from "../services/attendanceService";
import { getPayments } from "../services/paymentService";

function useDashboard() {
  const [dashboardData, setDashboardData] = useState({
    members: [],
    trainers: [],
    plans: [],
    attendance: [],
    payments: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const user = getCurrentUser();
      const role = user?.role;

      const membersPromise = getMembers();
      const attendancePromise = getAttendance();
      const paymentsPromise = getPayments();

      let trainersPromise = Promise.resolve([]);
      let plansPromise = Promise.resolve([]);

      // Only Admin and Manager can access
      // Trainers and Membership Plans APIs
      if (role === "Admin" || role === "Manager") {
        trainersPromise = getTrainers();
        plansPromise = getMembershipPlans();
      }

      const [
        members,
        trainers,
        plans,
        attendance,
        payments,
      ] = await Promise.all([
        membersPromise,
        trainersPromise,
        plansPromise,
        attendancePromise,
        paymentsPromise,
      ]);

      setDashboardData({
        members: members || [],
        trainers: trainers || [],
        plans: plans || [],
        attendance: attendance || [],
        payments: payments || [],
      });

    } catch (error) {
      console.error(
        "Failed to fetch dashboard data:",
        error
      );

      setError(
        error.message ||
        "Failed to load dashboard data."
      );

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...dashboardData,
    loading,
    error,
    fetchDashboardData,
  };
}

export default useDashboard;