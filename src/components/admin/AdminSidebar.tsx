
import React from 'react';
import {
  BarChart,
  Settings,
  Users,
  FileText,
  Database,
  BookOpen,
  LogOut
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <BarChart className="h-4 w-4" />,
      href: "/admin/dashboard",
    },
    {
      title: "Content",
      icon: <FileText className="h-4 w-4" />,
      href: "/admin/content",
    },
    {
      title: "Users",
      icon: <Users className="h-4 w-4" />,
      href: "/admin/users",
    },
    {
      title: "Analytics",
      icon: <BarChart className="h-4 w-4" />,
      href: "/admin/analytics",
    },
    {
      title: "Index Medicus",
      icon: <BookOpen className="h-4 w-4" />,
      href: "/admin/index-medicus",
    },
    {
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/admin/settings",
    }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 -ml-2">
          Administration
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Administration</SheetTitle>
          <SheetDescription>
            Gérer le contenu, les utilisateurs et les paramètres de l'application.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          {menuItems.map((item) => (
            <Link key={item.title} to={item.href} className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-secondary transition-colors block">
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
        <Separator className="my-4" />
        <Button variant="destructive" onClick={handleSignOut} className="w-full flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>Se déconnecter</span>
        </Button>
      </SheetContent>
    </Sheet>
  );
};
