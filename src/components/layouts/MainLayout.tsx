import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = ({ children, className = "" }: MainLayoutProps) => {
  return (
    <div className={`min-h-screen bg-[#f8fafc] ${className}`}>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
        <main className="relative">
          {children}
        </main>
      </Suspense>
      <Footer />
    </div>
  );
};