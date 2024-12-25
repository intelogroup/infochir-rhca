import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { PrivateRoute } from "./auth/PrivateRoute";
import { AdminRoute } from "./auth/AdminRoute";
import { LoadingSpinner } from "./auth/LoadingSpinner";

const Index = lazy(() => import("@/pages/Index"));
const RHCA = lazy(() => import("@/pages/RHCA"));
const IGM = lazy(() => import("@/pages/IGM"));
const ADC = lazy(() => import("@/pages/ADC"));
const IndexMedicus = lazy(() => import("@/pages/IndexMedicus"));
const Admin = lazy(() => import("@/pages/Admin"));
const AuthPage = lazy(() => import("@/pages/Auth"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const routes = [
  {
    path: "/",
    element: <Index />,
    private: true,
    showNavbar: true,
  },
  {
    path: "/auth",
    element: <AuthPage />,
    private: false,
    showNavbar: false,
  },
  {
    path: "/admin",
    element: <Admin />,
    isAdmin: true,
    showNavbar: false,
  },
  {
    path: "/rhca",
    element: <RHCA />,
    private: true,
    showNavbar: false,
  },
  {
    path: "/igm",
    element: <IGM />,
    private: true,
    showNavbar: false,
  },
  {
    path: "/adc",
    element: <ADC />,
    private: true,
    showNavbar: false,
  },
  {
    path: "/index-medicus",
    element: <IndexMedicus />,
    private: true,
    showNavbar: false,
  },
];

export const AppRoutes = () => {
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const showNavbar = currentRoute?.showNavbar ?? true;

  return (
    <>
      {showNavbar && <Navbar />}
      <Suspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <Routes>
          {routes.map(({ path, element, private: isPrivate, isAdmin }) => (
            <Route
              key={path}
              path={path}
              element={
                isAdmin ? (
                  <AdminRoute>{element}</AdminRoute>
                ) : isPrivate ? (
                  <PrivateRoute>{element}</PrivateRoute>
                ) : (
                  element
                )
              }
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};