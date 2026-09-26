import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";

function ProtectedRoute() {
  console.log("Token:", localStorage.getItem("token"));
  console.log("User:", localStorage.getItem("user"));

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;