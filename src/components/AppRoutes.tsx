import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { PrivateRoute } from "./auth/PrivateRoute";
import { AdminRoute } from "./auth/AdminRoute";
import Index from "@/pages/Index";
import RHCA from "@/pages/RHCA";
import IGM from "@/pages/IGM";
import ADC from "@/pages/ADC";
import IndexMedicus from "@/pages/IndexMedicus";
import Admin from "@/pages/Admin";
import AuthPage from "@/pages/Auth";
import { useAuthState } from "@/hooks/useAuthState";

export const AppRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthState();
  const hideNavbarPaths = ['/igm', '/rhca', '/index-medicus', '/adc', '/auth', '/admin'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only redirect if not loading and not authenticated
  if (!isLoading && !isAuthenticated && location.pathname !== '/auth') {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Only redirect if not loading and authenticated
  if (!isLoading && isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/rhca" element={<PrivateRoute><RHCA /></PrivateRoute>} />
        <Route path="/igm" element={<PrivateRoute><IGM /></PrivateRoute>} />
        <Route path="/adc" element={<PrivateRoute><ADC /></PrivateRoute>} />
        <Route path="/index-medicus" element={<PrivateRoute><IndexMedicus /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};