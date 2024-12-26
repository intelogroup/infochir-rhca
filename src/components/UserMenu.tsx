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
  const defaultAvatarUrl = "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952";
  
  const handleAvatarUpdate = () => {
    console.log("Update avatar clicked");
  };

  return (
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
              size="icon"
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
  );
};