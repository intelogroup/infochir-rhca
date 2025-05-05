
import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BackToTop from "@/components/navigation/BackToTop";
import { useAnalytics } from "@/hooks/use-analytics";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showFooter = location.pathname === "/" || location.pathname === "/index";

  // Initialize analytics
  useAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden"
        >
          {children || <Outlet />}
        </motion.main>
      </AnimatePresence>
      {showFooter && <Footer />}
      <BackToTop />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: "shadow-lg border border-gray-100",
          style: {
            background: "white",
            borderRadius: "0.5rem",
          }
        }}
      />
    </div>
  );
};
