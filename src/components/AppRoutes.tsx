import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./auth/PrivateRoute";

const Index = lazy(() => import("@/pages/Index"));
const AuthPage = lazy(() => import("@/pages/Auth"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Index />
          </PrivateRoute>
        }
      />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};