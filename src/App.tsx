
import React, { useState, useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
  useLocation
} from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { createClient } from '@supabase/supabase-js';
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
import { queryClient } from '@/lib/react-query';
import { WelcomeModal } from "./components/welcome/WelcomeModal";
import { ProductInfoModal } from "./components/welcome/ProductInfoModal";

function App() {
  const [session, setSession] = useState(null);
  const location = useLocation();

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
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
        {/* Index Medicus Routes */}
        <Route path="/index-medicus" element={<IndexMedicus />} />

        {/* ADC Route */}
        <Route path="/adc" element={<ADC />} />

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
      
      {/* Welcome modals */}
      <div id="welcome-modals">
        <WelcomeModal />
        <ProductInfoModal />
      </div>
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
