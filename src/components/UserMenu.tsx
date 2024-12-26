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

export const UserMenu = () => {
  const handleAvatarUpdate = () => {
    // TODO: Implement avatar update functionality
    console.log("Update avatar clicked");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
            />
            <div className="absolute -right-1 -bottom-1">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white">
        <div className="flex items-center justify-center p-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover ring-2 ring-white"
            />
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