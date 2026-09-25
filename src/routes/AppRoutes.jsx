import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard";
import Members from "../pages/Members";
import Trainers from "../pages/Trainers";
import MembershipPlans from "../pages/MembershipPlans";
import Attendance from "../pages/Attendance";
import Payments from "../pages/Payments";
import Login from "../pages/Login";
import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRoutes() {
  return (


    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>

      <Route
        path="/"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      <Route
        path="/members"
        element={
          <Layout>
            <Members />
          </Layout>
        }
      />

      <Route
        path="/trainers"
        element={
          <Layout>
            <Trainers />
          </Layout>
        }
      />

      <Route
        path="/membership-plans"
        element={
          <Layout>
            <MembershipPlans />
          </Layout>}
      />

      <Route
        path="/attendance"
        element={
          <Layout>
            <Attendance />
          </Layout>
        }
      />

      <Route
        path="/payments"
        element={
          <Layout>
            <Payments />
          </Layout>
        }
      />
      </Route>
    </Routes>
  );
}

export default AppRoutes;