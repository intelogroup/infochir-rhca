import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLinks } from "./navigation/NavLinks";
import { MobileMenu } from "./navigation/MobileMenu";
import { NavbarLogo } from "./navigation/NavbarLogo";
import { MobileMenuButton } from "./navigation/MobileMenuButton";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let touchStartY = 0;
    let pullDistance = 0;
    const threshold = 150;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY === 0) return;

      pullDistance = e.touches[0].clientY - touchStartY;
      if (pullDistance > 0 && pullDistance < threshold) {
        document.body.style.transform = `translateY(${pullDistance}px)`;
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold) {
        setRefreshing(true);
        document.body.style.transform = '';
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
      } else {
        document.body.style.transform = '';
      }
      touchStartY = 0;
      pullDistance = 0;
      setRefreshing(false);
    };

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {refreshing && (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary/20 z-50">
          <div className="h-full bg-primary animate-[loading_1s_ease-in-out_infinite]" />
        </div>
      )}
      <motion.nav 
        className="fixed w-full z-50"
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        role="navigation" 
        aria-label="Main navigation"
      >
        <div className="w-full border-b border-gray-200/50 bg-white/85 backdrop-blur-md shadow-lg">
          <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-12">
            <div className="flex h-16 md:h-20 items-center justify-between">
              <NavbarLogo />

              <div className="hidden md:flex md:items-center md:justify-center space-x-2 lg:space-x-4">
                <NavLinks />
              </div>

              <MobileMenuButton 
                isOpen={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              />
            </div>
          </div>

          <AnimatePresence>
            <MobileMenu 
              isOpen={isOpen} 
              onClose={() => setIsOpen(false)} 
            />
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
};