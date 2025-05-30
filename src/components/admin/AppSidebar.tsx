
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Settings,
  Users,
  FileText,
  BookOpen,
  LogOut,
  Home,
  Mail,
  TrendingUp
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/use-admin-auth';

const mainMenuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/admin/dashboard",
    description: "Vue d'ensemble"
  },
  {
    title: "Contenu",
    icon: FileText,
    href: "/admin/content",
    description: "Gérer les articles"
  },
  {
    title: "Utilisateurs",
    icon: Users,
    href: "/admin/users",
    description: "Gestion des rôles"
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    href: "/admin/analytics",
    description: "Statistiques"
  },
  {
    title: "Index Medicus",
    icon: BookOpen,
    href: "/admin/index-medicus",
    description: "Base de données"
  }
];

const settingsMenuItems = [
  {
    title: "Paramètres",
    icon: Settings,
    href: "/admin/settings",
    description: "Configuration"
  },
  {
    title: "Email",
    icon: Mail,
    href: "/admin/email-settings",
    description: "Configuration email"
  }
];

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAdminAuth();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="border-b border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate">Administration</span>
            <span className="text-xs text-gray-500 truncate">Infochir-RHCA</span>
            {user && (
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="default" className="text-xs px-1.5 py-0.5">
                  Admin
                </Badge>
              </div>
            )}
          </div>
        </div>
        {user && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 truncate" title={user.email}>
              {user.email}
            </p>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                    className="group relative"
                  >
                    <Link to={item.href} className="flex items-center gap-3 p-2">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">{item.title}</span>
                        <span className="text-xs text-gray-500 truncate">{item.description}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                  >
                    <Link to={item.href} className="flex items-center gap-3 p-2">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">{item.title}</span>
                        <span className="text-xs text-gray-500 truncate">{item.description}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-100 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button 
              variant="ghost" 
              onClick={handleSignOut} 
              className="w-full justify-start gap-3 h-10 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Se déconnecter</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
