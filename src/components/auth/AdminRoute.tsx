import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { LoadingSpinner } from "./LoadingSpinner";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, isLoading, error } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};