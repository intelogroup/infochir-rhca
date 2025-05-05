
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
  const prevPathRef = React.useRef(location.pathname);

  // Initialize analytics
  useAnalytics();

  // Notify that the app has loaded when component mounts
  React.useEffect(() => {
    // Mark the initial load as complete immediately to prevent loading spinner on first render
    setInitialLoadComplete(true);
    
    // Notify that the app has loaded
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('app-loaded'));
    }
    
    // Immediately preload all top-level routes
    const preloadLinks = document.head.querySelectorAll('link[rel="prefetch"]');
    if (preloadLinks.length === 0) {
      ['/', '/about', '/rhca', '/igm', '/submission', '/donate'].forEach(path => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        link.as = 'document';
        document.head.appendChild(link);
      });
    }
  }, []);

  // Handle navigation loading states
  React.useEffect(() => {
    // Only show loading when changing paths (not on initial load)
    if (initialLoadComplete && location.pathname !== prevPathRef.current) {
      setIsLoading(true);
      
      // Short timeout to simulate minimum loading time and prevent flickering
      const timer = setTimeout(() => {
        setIsLoading(false);
        prevPathRef.current = location.pathname;
        
        // Dispatch route change event
        window.dispatchEvent(new Event('route-changed'));
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, initialLoadComplete]);

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
