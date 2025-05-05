
import * as React from "react";
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BackToTop from "@/components/navigation/BackToTop";
import { useAnalytics } from "@/hooks/use-analytics";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const showFooter = location.pathname === "/" || location.pathname === "/index";
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Initialize analytics
  useAnalytics();

  // Handle initial load and navigation
  useEffect(() => {
    // Skip loading state for initial render after component is mounted
    if (!initialLoadComplete) {
      setInitialLoadComplete(true);
      return;
    }
    
    // Only show loading state for navigation (not initial page load)
    setIsLoading(true);
    
    // Short timeout to simulate minimum loading time and prevent flickering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
      <Navbar />
      
      <main className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className="flex items-center justify-center min-h-[50vh]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingSpinner 
                variant="primary"
                size="lg"
                text="Chargement..."
              />
            </motion.div>
          ) : (
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children || <Outlet />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {showFooter && <Footer />}
      <BackToTop />
    </div>
  );
};
