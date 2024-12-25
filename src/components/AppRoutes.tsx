import { Routes, Route, useLocation } from "react-router-dom";
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

export const AppRoutes = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/igm', '/rhca', '/index-medicus', '/adc', '/auth', '/admin'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

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
      </Routes>
    </>
  );
};