import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard";
import Members from "../pages/Members";
import Trainers from "../pages/Trainers";
import Memberships from "../pages/Memberships";
import Attendance from "../pages/Attendance";
import Payments from "../pages/Payments";

function AppRoutes() {
  return (
    <Routes>
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
        path="/memberships"
        element={
          <Layout>
            <Memberships />
          </Layout>
        }
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
    </Routes>
  );
}

export default AppRoutes;