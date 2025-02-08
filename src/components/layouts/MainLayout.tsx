
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = ({ children, className = "" }: MainLayoutProps) => {
  return (
    <div className={`min-h-screen bg-[#f8fafc] ${className}`}>
      <Navbar />
      <main className="relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};
