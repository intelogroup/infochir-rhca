import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "RHCA", href: "#rhca" },
    { name: "Index Medicus", href: "#index-medicus" },
    { name: "Atlas ADC", href: "#atlas" },
    { name: "IGM", href: "#igm" },
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
                className="text-primary hover:text-secondary transition-colors"
              >
                {item.name}
              </a>
            ))}
            <button className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors">
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
                className="block px-3 py-2 text-primary hover:text-secondary transition-colors"
              >
                {item.name}
              </a>
            ))}
            <button className="w-full mt-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors">
              Soumettre
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};