
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const NavbarLogo = () => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/');
  };
  
  return (
    <button 
      onClick={handleLogoClick}
      className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 transition-all duration-300 hover:scale-[0.98] active:scale-[0.95] touch-manipulation"
      aria-label="Return to homepage"
    >
      <motion.img
        src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
        alt="Info Chir Logo"
        className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 object-contain transition-all duration-300 hover:brightness-110"
        loading="eager"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
      <span className="font-serif text-base sm:text-lg md:text-xl lg:text-[1.375rem] font-bold tracking-[-0.01em] text-foreground whitespace-nowrap">
        INFOCHIR<span className="text-primary">/</span>RHCA
      </span>
    </button>
  );
};
