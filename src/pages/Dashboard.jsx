import { useMemo } from "react";
import { Link } from "react-router-dom";
import useDashboard from "../hooks/useDashboard";

function Dashboard() {
  const {
    members,
    trainers,
    plans,
    attendance,
    payments,
    loading,
    error,
    fetchDashboardData,
  } = useDashboard();

  // ========================================
  // TODAY'S DATE
  // ========================================
  const today = new Date();

  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // ========================================
  // DASHBOARD STATISTICS
  // ========================================
  const statistics = useMemo(() => {
    const activeMembers = members.filter(
      (member) => member.status === "Active"
    ).length;

    const activeTrainers = trainers.filter(
      (trainer) => trainer.status === "Active"
    ).length;

    const activePlans = plans.filter(
      (plan) => plan.status === "Active"
    ).length;

    const completedPayments = payments.filter(
      (payment) => payment.status === "Completed"
    );

    const totalRevenue = completedPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

    const pendingPayments = payments.filter(
      (payment) => payment.status === "Pending"
    ).length;

    const todayAttendance = attendance.filter(
      (record) => record.attendance_date === todayString
    ).length;

    return {
      totalMembers: members.length,
      activeMembers,
      totalTrainers: trainers.length,
      activeTrainers,
      activePlans,
      totalRevenue,
      pendingPayments,
      todayAttendance,
    };
  }, [
    members,
    trainers,
    plans,
    attendance,
    payments,
    todayString,
  ]);

  // ========================================
  // MEMBERSHIP PLAN DISTRIBUTION
  // ========================================
  const planDistribution = useMemo(() => {
    return plans
      .filter((plan) => plan.status === "Active")
      .map((plan) => {
        const memberCount = members.filter(
          (member) =>
            Number(member.plan_id) === Number(plan.id)
        ).length;

        return {
          id: plan.id,
          name: plan.name,
          members: memberCount,
        };
      });
  }, [plans, members]);

  // ========================================
  // RECENT PAYMENTS
  // ========================================
  const recentPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => {
        const dateA = new Date(a.payment_date || 0);
        const dateB = new Date(b.payment_date || 0);

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [payments]);

  // ========================================
  // LOADING STATE
  // ========================================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>

        <h2 className="text-xl font-bold text-gray-800">
          Unable to load dashboard
        </h2>

        <p className="text-gray-500 mt-2">
          {error}
        </p>

        <button
          type="button"
          onClick={fetchDashboardData}
          className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ========================================
          PAGE HEADER
      ======================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Overview of your gym management system
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          ↻ Refresh
        </button>
      </div>

      {/* ========================================
          STATISTICS CARDS
      ======================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Members */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Members
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {statistics.totalMembers}
              </h2>

              <p className="text-sm text-green-600 mt-2">
                {statistics.activeMembers} active
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
        </div>

        {/* Trainers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Trainers
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {statistics.totalTrainers}
              </h2>

              <p className="text-sm text-green-600 mt-2">
                {statistics.activeTrainers} active
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
              🏋️
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Revenue
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {statistics.totalRevenue.toLocaleString()} ETB
              </h2>

              <p className="text-sm text-green-600 mt-2">
                Completed payments
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
              💰
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Today's Attendance
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {statistics.todayAttendance}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Attendance records today
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
              📅
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          SECONDARY STATISTICS
      ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Active Plans */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Membership Plans
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {statistics.activePlans}
              </h2>
            </div>

            <div className="text-3xl">
              📋
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending Payments
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {statistics.pendingPayments}
              </h2>
            </div>

            <div className="text-3xl">
              ⏳
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ========================================
            MEMBERSHIP PLAN DISTRIBUTION
        ======================================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Membership Plans
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Members by active plan
              </p>
            </div>

            <Link
              to="/membership-plans"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Plans →
            </Link>
          </div>

          <div className="p-6">

            {planDistribution.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No active membership plans.
              </p>
            ) : (
              <div className="space-y-5">
                {planDistribution.map((plan) => (
                  <div key={plan.id}>

                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">
                        {plan.name}
                      </span>

                      <span className="text-sm font-semibold text-gray-800">
                        {plan.members} members
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all"
                        style={{
                          width: `${
                            statistics.totalMembers > 0
                              ? Math.min(
                                  (plan.members /
                                    statistics.totalMembers) *
                                    100,
                                  100
                                )
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* ========================================
            RECENT PAYMENTS
        ======================================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Recent Payments
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest payment transactions
              </p>
            </div>

            <Link
              to="/payments"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Payments →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">

            {recentPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No payments found.
              </p>
            ) : (
              recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-5 flex items-center justify-between gap-4"
                >

                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {payment.member_name ||
                        "Unknown Member"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {payment.payment_date || "N/A"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-semibold text-gray-800">
                      {Number(
                        payment.amount || 0
                      ).toLocaleString()}{" "}
                      ETB
                    </p>

                    <span
                      className={`text-xs font-medium ${
                        payment.status === "Completed"
                          ? "text-green-600"
                          : payment.status === "Pending"
                          ? "text-yellow-600"
                          : payment.status === "Refunded"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {payment.status || "Unknown"}
                    </span>
                  </div>

                </div>
              ))
            )}

          </div>
        </div>
      </div>

      {/* ========================================
          QUICK ACTIONS
      ======================================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Quickly access common management tasks
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Link
            to="/members"
            className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
          >
            <div className="text-2xl mb-2">
              👥
            </div>

            <h3 className="font-semibold text-gray-800">
              Manage Members
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Add and manage gym members
            </p>
          </Link>

          <Link
            to="/trainers"
            className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition"
          >
            <div className="text-2xl mb-2">
              🏋️
            </div>

            <h3 className="font-semibold text-gray-800">
              Manage Trainers
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Manage your trainers
            </p>
          </Link>

          <Link
            to="/attendance"
            className="p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition"
          >
            <div className="text-2xl mb-2">
              📅
            </div>

            <h3 className="font-semibold text-gray-800">
              Attendance
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Track member attendance
            </p>
          </Link>

          <Link
            to="/payments"
            className="p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition"
          >
            <div className="text-2xl mb-2">
              💳
            </div>

            <h3 className="font-semibold text-gray-800">
              Payments
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Manage payment transactions
            </p>
          </Link>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;