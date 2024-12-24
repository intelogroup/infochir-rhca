import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { 
      name: "RHCA", 
      href: "/rhca"
    },
    { 
      name: "Index Medicus", 
      href: "/index-medicus"
    },
    { 
      name: "Atlas ADC", 
      href: "/adc"
    },
    { 
      name: "IGM", 
      href: "/igm"
    },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
                alt="Info Chir Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-xl font-bold ml-2">
                INFOCHIR
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className="text-gray-700 hover:text-primary transition-colors duration-200 h-16 flex items-center font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 p-2 rounded-lg hover:bg-gray-100/50 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
          <div className="px-4 pt-2 pb-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100/50 transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};