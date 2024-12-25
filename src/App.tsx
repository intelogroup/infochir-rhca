import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import RHCA from "./pages/RHCA";
import IGM from "./pages/IGM";
import ADC from "./pages/ADC";
import IndexMedicus from "./pages/IndexMedicus";
import Admin from "./pages/Admin";
import { Navbar } from "./components/Navbar";
import AuthPage from "./pages/Auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) {
          setIsAuthenticated(!!session);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    // Initial session check
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session);
      
      if (event === 'SIGNED_OUT') {
        if (mounted) setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        try {
          const { data, error } = await supabase.auth.getUser();
          if (error) throw error;
          if (mounted) setIsAuthenticated(!!data.user);
        } catch (error) {
          console.error("Error getting user:", error);
          if (mounted) setIsAuthenticated(false);
        }
      }
      
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/igm', '/rhca', '/index-medicus', '/adc', '/auth', '/admin'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        <Route path="/rhca" element={<PrivateRoute><RHCA /></PrivateRoute>} />
        <Route path="/igm" element={<PrivateRoute><IGM /></PrivateRoute>} />
        <Route path="/adc" element={<PrivateRoute><ADC /></PrivateRoute>} />
        <Route path="/index-medicus" element={<PrivateRoute><IndexMedicus /></PrivateRoute>} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;