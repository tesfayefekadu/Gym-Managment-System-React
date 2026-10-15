import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../../services/authService";

function ProtectedRoute({ allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  // Missing or invalid user data
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // Restrict access by role when allowedRoles is provided
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
