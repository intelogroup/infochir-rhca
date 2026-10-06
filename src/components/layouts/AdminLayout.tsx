
import * as React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { useLocation, Outlet } from "react-router-dom";

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  // Generate breadcrumbs based on current location
  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    const breadcrumbs = [
      { label: "Administration", href: "/admin/articles" }
    ];
    
    const labels: Record<string, string> = {
      "/admin/articles": "Articles",
      "/admin/users": "Utilisateurs",
      "/admin/analytics": "Analytics",
      "/admin/email-settings": "Email",
      "/admin/files": "Import & outils",
      "/admin/index-medicus": "Index Medicus",
      "/admin/settings": "Paramètres",
      "/admin/debug": "Debug",
    };
    if (path.startsWith("/admin/articles/")) {
      breadcrumbs.push({ label: "Articles", href: "/admin/articles" });
      breadcrumbs.push({ label: path === "/admin/articles/new" ? "Nouvel article" : "Modifier", href: path });
    } else if (labels[path]) {
      breadcrumbs.push({ label: labels[path], href: path });
    }

    return breadcrumbs;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs items={getBreadcrumbs()} />
          </header>
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
