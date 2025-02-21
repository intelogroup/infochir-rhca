
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { navItems } from "@/config/navigation";
import { Heart } from "lucide-react";
import { useState } from "react";

export const NavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const heartBubbles = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const bubble = {
    hidden: { 
      opacity: 0,
      y: 0,
      scale: 0.5
    },
    visible: {
      opacity: [0, 1, 0],
      y: -30,
      scale: [0.5, 1.2, 0.5],
      transition: {
        duration: 0.8,
        repeat: 0,
      }
    }
  };

  const handleDonateClick = () => {
    setAnimationKey(prev => prev + 1);
    setIsAnimating(true);
    navigate('/donate');
    setTimeout(() => {
      setIsAnimating(false);
    }, 5000);
  };

  return (
    <div className="flex items-center gap-2 md:gap-3 lg:gap-4" role="menubar">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <motion.button
            key={item.name}
            onClick={() => navigate(item.href)}
            className={`
              group relative flex h-9 md:h-10 w-auto px-3 md:px-4 items-center justify-center 
              rounded-full transition-all duration-300 
              ${isActive 
                ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg hover:shadow-xl hover:scale-105' 
                : 'bg-white/90 hover:bg-white text-gray-600 hover:text-primary border border-gray-200/50 shadow-sm hover:shadow-md hover:border-primary/20'
              }
              focus:outline-none focus:ring-2 focus:ring-primary/20
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            role="menuitem"
            aria-label={item.name}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.icon && (
              <item.icon 
                className={`h-4 md:h-4.5 w-4 md:w-4.5 mr-2 
                  ${isActive ? 'text-white' : 'text-primary/70 group-hover:text-primary transition-colors'}`} 
                aria-hidden="true" 
              />
            )}
            <span className="text-sm md:text-[0.9375rem] font-medium">{item.name}</span>
            {isActive && (
              <motion.div 
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                layoutId="activeIndicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}

      <motion.button
        onClick={handleDonateClick}
        className={`
          group relative
          flex h-9 md:h-10 px-4 md:px-5 items-center justify-center rounded-full
          bg-gradient-to-r from-secondary to-secondary-light
          text-white shadow-lg hover:shadow-xl transition-all duration-300
          ml-2 md:ml-3 space-x-2 focus:outline-none focus:ring-2
          focus:ring-secondary/30 hover:scale-105
          ${location.pathname === '/donate' ? 'ring-2 ring-secondary' : ''}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        role="menuitem"
        aria-label="Faire un don"
        aria-current={location.pathname === '/donate' ? 'page' : undefined}
      >
        <span className="text-sm md:text-[0.9375rem] font-medium whitespace-nowrap">Faire un don</span>
        <div className="relative">
          <Heart 
            className="h-4 md:h-4.5 w-4 md:w-4.5 text-white fill-white transition-all duration-300 group-hover:fill-[#ea384c] group-hover:text-[#ea384c] group-hover:animate-[shake_0.5s_ease-in-out_infinite]" 
            aria-hidden="true" 
          />
          <motion.div
            key={animationKey}
            initial="hidden"
            animate={isAnimating ? "visible" : "hidden"}
            variants={heartBubbles}
            className="absolute -top-2 -left-2 w-8 h-8 pointer-events-none"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                variants={bubble}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              >
                <Heart 
                  className="h-3 w-3 text-[#ea384c] fill-[#ea384c]"
                  aria-hidden="true"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.button>
    </div>
  );
};
