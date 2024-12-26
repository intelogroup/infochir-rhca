import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown, Camera } from "lucide-react";
import { userNavigation } from "@/config/navigation";
import { Link } from "react-router-dom";

interface UserMenuProps {
  avatarUrl?: string;
}

export const UserMenu = ({ avatarUrl }: UserMenuProps) => {
  const defaultAvatarUrl = "/lovable-uploads/d2031e37-eafc-4c7c-b6b0-edc61f24c8fb.png";
  const username = "Alouidor"; // Static username since we're not using auth
  
  const handleAvatarUpdate = () => {
    console.log("Update avatar clicked");
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-700 font-medium hidden md:block">
        {username.charAt(0).toUpperCase() + username.slice(1)}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full p-0 overflow-hidden"
          >
            <img
              src={avatarUrl || defaultAvatarUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white">
          <div className="flex items-center justify-center p-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/10">
                <img
                  src={avatarUrl || defaultAvatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary hover:bg-primary/90"
                onClick={handleAvatarUpdate}
              >
                <Camera className="h-3 w-3 text-white" />
              </Button>
            </div>
          </div>
          {userNavigation.map((item) => (
            <DropdownMenuItem key={item.name} asChild>
              <Link
                to={item.href}
                className="flex w-full items-center px-3 py-2 text-sm"
              >
                {item.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};