import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { navItems } from "@/config/navigation";
import { UserMenu } from "./UserMenu";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getHoverClass = (href: string) => {
    if (href === '/rhca' || href === '/adc') {
      return 'hover:bg-secondary hover:text-white';
    }
    if (href === '/igm' || href === '/index-medicus') {
      return 'hover:bg-primary hover:text-white';
    }
    return 'hover:text-primary';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
              alt="Info Chir Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-xl font-bold text-transparent">
              INFOCHIR
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`flex items-center font-medium text-gray-700 transition-colors duration-200 px-3 py-1.5 rounded-md ${getHoverClass(item.href)}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* User menu */}
          <div className="hidden md:flex md:items-center">
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors duration-200"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute w-full border-b border-gray-200/50 bg-white/90 backdrop-blur-sm md:hidden">
          <div className="space-y-2 px-4 pb-3 pt-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center rounded-lg px-3 py-2 font-medium text-gray-700 transition-colors duration-200 ${getHoverClass(item.href)}`}
              >
                {item.name}
              </button>
            ))}
            <div className="py-2">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};