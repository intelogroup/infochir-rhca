import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { PrivateRoute } from "./auth/PrivateRoute";
import { AdminRoute } from "./auth/AdminRoute";
import { LoadingSpinner } from "./auth/LoadingSpinner";

// Lazy load page components with descriptive chunk names
const Index = lazy(() => import(/* webpackChunkName: "index" */ "@/pages/Index"));
const RHCA = lazy(() => import(/* webpackChunkName: "rhca" */ "@/pages/RHCA"));
const IGM = lazy(() => import(/* webpackChunkName: "igm" */ "@/pages/IGM"));
const ADC = lazy(() => import(/* webpackChunkName: "adc" */ "@/pages/ADC"));
const IndexMedicus = lazy(() => import(/* webpackChunkName: "index-medicus" */ "@/pages/IndexMedicus"));
const Admin = lazy(() => import(/* webpackChunkName: "admin" */ "@/pages/Admin"));
const AuthPage = lazy(() => import(/* webpackChunkName: "auth" */ "@/pages/Auth"));
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ "@/pages/NotFound"));

// Route configuration with metadata
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

// Custom loading component for route transitions
const RouteLoadingSpinner = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

export const AppRoutes = () => {
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const showNavbar = currentRoute?.showNavbar ?? true;

  return (
    <>
      {showNavbar && <Navbar />}
      <Suspense fallback={<RouteLoadingSpinner />}>
        <Routes>
          {routes.map(({ path, element, private: isPrivate, isAdmin }) => (
            <Route
              key={path}
              path={path}
              element={
                isAdmin ? (
                  <AdminRoute>
                    <Suspense fallback={<RouteLoadingSpinner />}>
                      {element}
                    </Suspense>
                  </AdminRoute>
                ) : isPrivate ? (
                  <PrivateRoute>
                    <Suspense fallback={<RouteLoadingSpinner />}>
                      {element}
                    </Suspense>
                  </PrivateRoute>
                ) : (
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    {element}
                  </Suspense>
                )
              }
            />
          ))}
          <Route 
            path="*" 
            element={
              <Suspense fallback={<RouteLoadingSpinner />}>
                <NotFound />
              </Suspense>
            } 
          />
        </Routes>
      </Suspense>
    </>
  );
};