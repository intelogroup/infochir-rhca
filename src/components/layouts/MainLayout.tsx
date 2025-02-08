
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
        <main className="relative pt-24 md:pt-28 lg:pt-32">
          {children}
        </main>
      </Suspense>
      <Footer />
    </div>
  );
};
