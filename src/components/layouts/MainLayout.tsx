import { Navbar } from "@/components/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = ({ children, className = "" }: MainLayoutProps) => {
  return (
    <div className={`min-h-screen bg-[#f8fafc] ${className}`}>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};