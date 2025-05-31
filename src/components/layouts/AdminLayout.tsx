
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
      { label: "Administration", href: "/admin/dashboard" }
    ];
    
    if (path === "/admin/dashboard") {
      breadcrumbs.push({ label: "Dashboard", href: "/admin/dashboard" });
    } else if (path === "/admin/content") {
      breadcrumbs.push({ label: "Contenu", href: "/admin/content" });
    } else if (path === "/admin/articles/new") {
      breadcrumbs.push({ label: "Contenu", href: "/admin/content" });
      breadcrumbs.push({ label: "Nouvel Article", href: "/admin/articles/new" });
    } else if (path === "/admin/files") {
      breadcrumbs.push({ label: "Contenu", href: "/admin/content" });
      breadcrumbs.push({ label: "Gestion des Fichiers", href: "/admin/files" });
    } else if (path === "/admin/users") {
      breadcrumbs.push({ label: "Utilisateurs", href: "/admin/users" });
    } else if (path === "/admin/analytics") {
      breadcrumbs.push({ label: "Analytics", href: "/admin/analytics" });
    } else if (path === "/admin/index-medicus") {
      breadcrumbs.push({ label: "Index Medicus", href: "/admin/index-medicus" });
    } else if (path === "/admin/settings") {
      breadcrumbs.push({ label: "Paramètres", href: "/admin/settings" });
    } else if (path === "/admin/email-settings") {
      breadcrumbs.push({ label: "Paramètres Email", href: "/admin/email-settings" });
    } else if (path === "/admin/debug") {
      breadcrumbs.push({ label: "Debug Console", href: "/admin/debug" });
    }
    
    return breadcrumbs;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
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
