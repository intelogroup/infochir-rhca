
import * as React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Generate breadcrumbs based on current location
  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    const breadcrumbs = [
      { label: "Administration", href: "/admin" }
    ];
    
    if (path === "/admin/dashboard") {
      breadcrumbs.push({ label: "Dashboard" });
    } else if (path === "/admin/content") {
      breadcrumbs.push({ label: "Contenu" });
    } else if (path === "/admin/users") {
      breadcrumbs.push({ label: "Utilisateurs" });
    } else if (path === "/admin/analytics") {
      breadcrumbs.push({ label: "Analytics" });
    } else if (path === "/admin/index-medicus") {
      breadcrumbs.push({ label: "Index Medicus" });
    } else if (path === "/admin/settings") {
      breadcrumbs.push({ label: "Paramètres" });
    }
    
    return breadcrumbs;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs items={getBreadcrumbs()} />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
