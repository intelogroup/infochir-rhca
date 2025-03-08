
import React from "react";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  // Initialize performance monitoring
  usePerformanceMonitoring();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl">My Application</h1>
      </header>
      <main className="flex-grow p-4">
        {children || <Outlet />}
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <p>&copy; 2023 My Application</p>
      </footer>
    </div>
  );
};

export default MainLayout;
