import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { LoadingSpinner } from "./LoadingSpinner";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, error } = useAuth();

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

  return user ? <>{children}</> : <Navigate to="/auth" />;
};