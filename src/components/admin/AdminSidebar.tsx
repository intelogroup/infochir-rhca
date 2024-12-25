import { LayoutDashboard, FileText, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AdminSidebar = ({ isOpen }: AdminSidebarProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: FileText, label: "Articles", active: false },
    { icon: Users, label: "Users", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-20",
        isOpen ? "w-64" : "w-0 -translate-x-full"
      )}
    >
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-primary">Admin</span>
        </div>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors",
              item.active && "bg-primary/5 text-primary border-r-2 border-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};