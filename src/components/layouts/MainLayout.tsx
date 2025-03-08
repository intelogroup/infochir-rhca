
import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BackToTop from "@/components/navigation/BackToTop";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/hooks/usePageTransition";

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { transitionKey } = usePageTransition(location);
  const showFooter = location.pathname === "/" || location.pathname === "/index";

  // Improved page transition animations
  const pageVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
      <Navbar />
      <LazyMotion features={domAnimation}>
        <AnimatePresence mode="wait" initial={false}>
          <m.main 
            key={transitionKey}
            className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children || <Outlet />}
          </m.main>
        </AnimatePresence>
      </LazyMotion>
      {showFooter && <Footer />}
      <BackToTop />
    </div>
  );
};
