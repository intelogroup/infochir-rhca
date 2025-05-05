
import * as React from "react";
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BackToTop from "@/components/navigation/BackToTop";
import { useAnalytics } from "@/hooks/use-analytics";
import { motion, AnimatePresence } from "framer-motion";

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const showFooter = location.pathname === "/" || location.pathname === "/index";
  const [isLoading, setIsLoading] = React.useState(true);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // Initialize analytics
  useAnalytics();

  // Add a loading effect when navigating between pages
  useEffect(() => {
    if (prevPathname !== location.pathname) {
      setIsLoading(true);
      setPrevPathname(location.pathname);
      
      // Simulate page loading for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      // Initial load
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, prevPathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {children || <Outlet />}
            </>
          )}
        </motion.main>
      </AnimatePresence>
      
      {showFooter && <Footer />}
      <BackToTop />
    </div>
  );
};
