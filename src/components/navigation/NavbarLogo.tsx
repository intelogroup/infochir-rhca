
import { motion } from "framer-motion";

export const NavbarLogo = () => {
  const handleLogoClick = () => {
    window.location.href = '/';
  };
  
  return (
    <button 
      onClick={handleLogoClick}
      className="flex items-center space-x-3 sm:space-x-4 transition-all duration-300 hover:scale-[0.98] active:scale-[0.95] touch-manipulation"
      aria-label="Return to homepage"
    >
      <motion.img
        src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
        alt="Info Chir Logo"
        className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-all duration-300 hover:brightness-110"
        loading="eager"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
      <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-transparent whitespace-nowrap transition-all duration-300">
        INFOCHIR/RHCA
      </span>
    </button>
  );
};
