
import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BackToTop from "@/components/navigation/BackToTop";
import { m, AnimatePresence } from "framer-motion";

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const showFooter = location.pathname === "/" || location.pathname === "/index";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
      <Navbar />
      <AnimatePresence mode="wait">
        <m.main 
          key={location.pathname}
          className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {children || <Outlet />}
        </m.main>
      </AnimatePresence>
      {showFooter && <Footer />}
      <BackToTop />
    </div>
  );
};
