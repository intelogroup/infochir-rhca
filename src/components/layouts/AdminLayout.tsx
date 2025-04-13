
import * as React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { PageHeader } from "@/components/ui/page-header";
import { useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Generate page title based on current location
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === "/admin") return "Dashboard";
    if (path === "/admin/analytics") return "Analytics";
    if (path === "/admin/uploads") return "File Uploads";
    if (path === "/admin/content") return "Content Management";
    if (path === "/admin/users") return "User Management";
    if (path === "/admin/settings") return "Settings";
    
    return "Administration";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
