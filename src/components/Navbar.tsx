
import { useState, useEffect } from "react";
import { NavLinks } from "./navigation/NavLinks";
import { MobileMenu } from "./navigation/MobileMenu";
import { NavbarLogo } from "./navigation/NavbarLogo";
import { MobileMenuButton } from "./navigation/MobileMenuButton";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav 
      className={`fixed w-full z-50 transition-transform duration-300 ${!visible ? '-translate-y-full' : 'translate-y-0'}`}
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="w-full bg-white shadow-sm">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-12">
          <div className="flex h-16 md:h-[4.5rem] lg:h-20 items-center justify-between">
            {/* Logo section */}
            <div className="flex-shrink-0">
              <NavbarLogo />
            </div>

            {/* Navigation links */}
            <div className="hidden md:flex md:items-center md:justify-center md:space-x-1.5 lg:space-x-4">
              <NavLinks />
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <MobileMenuButton 
                isOpen={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              />
            </div>
          </div>
        </div>

        {isOpen && (
          <MobileMenu 
            isOpen={isOpen} 
            onClose={() => setIsOpen(false)} 
          />
        )}
      </div>
    </nav>
  );
};
