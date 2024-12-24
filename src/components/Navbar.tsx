import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { 
      name: "RHCA", 
      href: "#rhca",
      logo: "/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png",
      logoClass: "w-11 h-11"
    },
    { 
      name: "Index Medicus", 
      href: "#index-medicus",
      logo: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png",
      logoClass: "w-8 h-8"
    },
    { 
      name: "Atlas ADC", 
      href: "#atlas",
      logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png",
      logoClass: "w-11 h-11"
    },
    { 
      name: "IGM", 
      href: "#igm",
      logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
      logoClass: "w-11 h-11"
    },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
                alt="Info Chir Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-xl font-bold ml-2">
                INFOCHIR
              </span>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-200 h-16 group"
              >
                <div className="flex items-center justify-center h-full">
                  <img 
                    src={item.logo} 
                    alt={`${item.name} logo`} 
                    className={`object-contain ${item.logoClass} transition-transform duration-200 group-hover:scale-105`}
                  />
                </div>
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
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
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
              >
                <div className="flex items-center justify-center">
                  <img 
                    src={item.logo} 
                    alt={`${item.name} logo`} 
                    className={`object-contain ${item.logoClass}`}
                  />
                </div>
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};