import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/domains/login/store/useAuthStore";

function ProtectedRoute() {
  const authenticated = useAuthStore((state) => state.authenticated);

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
