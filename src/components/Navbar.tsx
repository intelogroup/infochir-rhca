import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLinks } from "./navigation/NavLinks";
import { MobileMenu } from "./navigation/MobileMenu";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-12">
        <div className="flex h-24 justify-between">
          <Link to="/" className="flex items-center space-x-8">
            <img
              src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
              alt="Info Chir Logo"
              className="h-24 w-24 object-contain"
            />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent">
              INFOCHIR/RHCA
            </span>
          </Link>

          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <NavLinks />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors duration-200"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
};