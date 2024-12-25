import { Navigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { LoadingSpinner } from "./LoadingSpinner";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthState();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};