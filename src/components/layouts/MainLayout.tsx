
import React from "react";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  // Initialize performance monitoring
  usePerformanceMonitoring();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl">My Application</h1>
      </header>
      <main className="flex-grow p-4">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <p>&copy; 2023 My Application</p>
      </footer>
    </div>
  );
}

export default MainLayout;
