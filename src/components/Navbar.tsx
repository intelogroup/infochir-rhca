import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { 
      name: "RHCA", 
      href: "#rhca",
      logo: "/lovable-uploads/e8fe216b-7e19-48a9-9251-22c63959d38c.png"
    },
    { 
      name: "Index Medicus", 
      href: "#index-medicus",
      logo: "/lovable-uploads/5d3116e3-d5c7-4fb3-a6ae-8ddf2d710f55.png"
    },
    { 
      name: "Atlas ADC", 
      href: "#atlas",
      logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
    },
    { 
      name: "IGM", 
      href: "#igm",
      logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
    },
  ];

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary text-xl font-bold">INFOCHIR</span>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors"
              >
                <img 
                  src={item.logo} 
                  alt={`${item.name} logo`} 
                  className="w-6 h-6 object-contain"
                />
                <span>{item.name}</span>
              </a>
            ))}
            <button className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors">
              Soumettre
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 text-primary hover:text-secondary transition-colors"
              >
                <img 
                  src={item.logo} 
                  alt={`${item.name} logo`} 
                  className="w-6 h-6 object-contain"
                />
                <span>{item.name}</span>
              </a>
            ))}
            <button className="w-full mt-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors">
              Soumettre
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};