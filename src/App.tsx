import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

// Import components
import { AppRoutes } from './components/routing/AppRoutes';
import { supabase } from './integrations/supabase/client';

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState(null);

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
  
  // Control initial modals - set localStorage flag to prevent showing on app init
  useEffect(() => {
    // Use localStorage to only show product info on specific product pages
    localStorage.setItem('hasSeenWelcome', 'true');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-center" richColors closeButton />
      <AppRoutes session={session} />
    </QueryClientProvider>
  );
}

// Create a simple auth wrapper component to be used in routes.jsx
export function AdminProtectedRoute({ children }) {
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
