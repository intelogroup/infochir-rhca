
import React, { useState, useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
  useLocation
} from 'react-router-dom';
import { Toaster } from "sonner";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

// Import components
import Home from './pages/Home';
import About from './pages/About';
import IndexMedicus from './pages/IndexMedicus';
import ADC from './pages/ADC';
import IndexMedicusAdmin from './pages/admin/IndexMedicusAdmin';
import Dashboard from './pages/admin/Dashboard';
import Content from './pages/admin/Content';
import Users from './pages/admin/Users';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import { supabase } from './integrations/supabase/client';
import { WelcomeModal } from "./components/welcome/WelcomeModal";
import { ProductInfoModal } from "./components/welcome/ProductInfoModal";
import { MainLayout } from './components/layouts/MainLayout';
import { getPublicRoutes, getAdminRoutes } from './config/routes';
import { preloadCommonRoutes, preloadRoute } from './lib/route-utils';

function App() {
  const [session, setSession] = useState(null);
  const location = useLocation();

  // Preload common routes on initial load
  useEffect(() => {
    // Preload common routes
    preloadCommonRoutes();
    
    // Log route changes
    console.info(`Route changed to: ${location.pathname}`);
    
    // Signal that route change is complete
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('route-changed'));
    }
    
    // Context-specific route preloading
    if (location.pathname === '/') {
      preloadRoute('/about');
      preloadRoute('/rhca');
    } else if (location.pathname === '/rhca') {
      preloadRoute('/rhca/article');
    }
  }, [location]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Cleanup subscription
    return () => subscription?.unsubscribe();
  }, []);

  return (
    <>
      <Toaster position="bottom-center" richColors closeButton />
      
      <Routes>
        {/* Public routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/index-medicus" element={<IndexMedicus />} />
          <Route path="/adc" element={<ADC />} />
          {/* Map all public routes from config */}
          {getPublicRoutes().map((route) => (
            route.path !== "" && 
            route.path !== "/" && 
            route.path !== "about" && 
            route.path !== "index-medicus" && 
            route.path !== "adc" && (
              <Route 
                key={route.name} 
                path={route.path} 
                element={route.element} 
              />
            )
          ))}
        </Route>

        {/* Auth route */}
        <Route
          path="/login"
          element={
            !session ? (
              <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-md">
                  <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['google', 'github']}
                    redirectTo={`${window.location.origin}/admin/dashboard`}
                  />
                </div>
              </div>
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          }
        />
        
        {/* Admin Routes */}
        <Route path="/admin">
          <Route index element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
          <Route path="dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
          <Route path="content" element={<AdminProtectedRoute><Content /></AdminProtectedRoute>} />
          <Route path="users" element={<AdminProtectedRoute><Users /></AdminProtectedRoute>} />
          <Route path="analytics" element={<AdminProtectedRoute><Analytics /></AdminProtectedRoute>} />
          <Route path="settings" element={<AdminProtectedRoute><Settings /></AdminProtectedRoute>} />
          <Route path="index-medicus" element={<AdminProtectedRoute><IndexMedicusAdmin /></AdminProtectedRoute>} />
        </Route>
      </Routes>
      
      {/* Welcome modals - Only show on specific routes */}
      {location.pathname === '/' && (
        <div id="welcome-modals">
          <WelcomeModal />
          <ProductInfoModal />
        </div>
      )}
    </>
  );
}

// Create a simple auth wrapper component
function AdminProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    
    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default App;
