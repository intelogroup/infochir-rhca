import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLinks } from "./navigation/NavLinks";
import { MobileMenu } from "./navigation/MobileMenu";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-12">
            <div className="flex h-16 md:h-20 items-center justify-between">
              <Link 
                to="/" 
                className="flex items-center space-x-2 sm:space-x-4 transition-transform duration-200 hover:scale-[0.98] touch-manipulation"
                aria-label="Return to homepage"
              >
                <img
                  src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
                  alt="Info Chir Logo"
                  className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain transition-all duration-200"
                />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-transparent whitespace-nowrap transition-all duration-200">
                  INFOCHIR/RHCA
                </span>
              </Link>

              <div className="hidden md:flex md:items-center md:justify-center space-x-4 lg:space-x-8">
                <NavLinks />
              </div>

              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-4 rounded-lg hover:bg-gray-100/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 touch-manipulation"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" aria-hidden="true" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
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