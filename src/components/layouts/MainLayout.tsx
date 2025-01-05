import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = ({ children, className = "" }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] w-full">
      <Navbar />
      <main className="w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};