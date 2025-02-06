import { motion, useAnimation } from "framer-motion";
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
    <div className="flex items-center gap-1 md:gap-1.5 lg:gap-3" role="menubar">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <motion.button
            key={item.name}
            onClick={() => navigate(item.href)}
            className={`
              flex h-8 md:h-9 w-auto px-2 md:px-3 items-center justify-center rounded-full
              text-[0.8125rem] md:text-sm
              transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50
              ${isActive 
                ? 'bg-primary text-white shadow-md hover:bg-primary-light' 
                : 'bg-gradient-to-br from-primary/10 to-secondary/10 text-primary hover:from-primary/20 hover:to-secondary/20 hover:shadow-sm'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            role="menuitem"
            aria-label={item.name}
            aria-current={isActive ? 'page' : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(item.href);
              }
            }}
          >
            {item.icon && (
              <item.icon 
                className={`h-3.5 md:h-4 w-3.5 md:w-4 mr-1.5 md:mr-2 ${isActive ? 'text-white' : 'text-primary/80'}`} 
                aria-hidden="true" 
              />
            )}
            <span className="text-[0.8125rem] md:text-sm font-medium">{item.name}</span>
          </motion.button>
        );
      })}

      <motion.button
        onClick={handleDonateClick}
        className={`
          group relative
          flex h-8 md:h-9 px-3 md:px-4 items-center justify-center rounded-full
          bg-gradient-to-r from-secondary to-secondary-light
          text-white hover:opacity-90 transition-all duration-300
          ml-1 md:ml-2 space-x-1.5 md:space-x-2 focus:outline-none focus:ring-2
          focus:ring-secondary/50 shadow-md hover:shadow-lg
          ${location.pathname === '/donate' ? 'opacity-90 ring-2 ring-secondary' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        role="menuitem"
        aria-label="Faire un don"
        aria-current={location.pathname === '/donate' ? 'page' : undefined}
      >
        <span className="text-[0.8125rem] md:text-sm font-medium whitespace-nowrap">Faire un don</span>
        <div className="relative">
          <Heart 
            className="h-3.5 md:h-4 w-3.5 md:w-4 text-white fill-white transition-all duration-300 group-hover:fill-[#ea384c] group-hover:text-[#ea384c] group-hover:animate-[shake_0.5s_ease-in-out_infinite]" 
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
