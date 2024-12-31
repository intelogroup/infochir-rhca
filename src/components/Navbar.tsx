import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLinks } from "./navigation/NavLinks";
import { MobileMenu } from "./navigation/MobileMenu";
import { Input } from "./ui/input";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // You can implement search logic here
  };

  return (
    <div className="relative z-50">
      <nav className="w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <img
                src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
                alt="Info Chir Logo"
                className="h-16 w-16 object-contain"
              />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-xl sm:text-2xl md:text-3xl font-bold text-transparent whitespace-nowrap">
                INFOCHIR/RHCA
              </span>
            </Link>

            <div className="hidden md:flex md:items-center md:justify-center space-x-8">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10 h-9 bg-white/50 border-gray-200/50 focus:border-primary/50 focus:ring-primary/50"
                />
              </div>
              <NavLinks />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <MobileMenu 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
      </nav>
    </div>
  );
};