
import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BackToTop from "@/components/navigation/BackToTop";
import { useAnalytics } from "@/hooks/use-analytics";

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
      <main className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden">
        {children || <Outlet />}
      </main>
      {showFooter && <Footer />}
      <BackToTop />
    </div>
  );
};
