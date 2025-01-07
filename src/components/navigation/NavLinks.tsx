import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { navItems } from "@/config/navigation";
import { Heart } from "lucide-react";

export const NavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const heartBubbles = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
      y: -20,
      scale: [0.5, 1, 0.5],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }
    }
  };

  return (
    <div className="flex items-center gap-2 lg:gap-3" role="menubar">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <motion.button
            key={item.name}
            onClick={() => navigate(item.href)}
            className={`
              flex h-9 w-auto px-3 items-center justify-center rounded-full
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
                className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : 'text-primary/80'}`} 
                aria-hidden="true" 
              />
            )}
            <span className="text-sm font-medium">{item.name}</span>
          </motion.button>
        );
      })}
      <motion.button
        onClick={() => navigate('/donate')}
        className={`
          group relative
          flex h-9 px-4 items-center justify-center rounded-full
          bg-gradient-to-r from-secondary to-secondary-light
          text-white hover:opacity-90 transition-all duration-300
          ml-2 space-x-2 focus:outline-none focus:ring-2
          focus:ring-secondary/50 shadow-md hover:shadow-lg
          ${location.pathname === '/donate' ? 'opacity-90 ring-2 ring-secondary' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        role="menuitem"
        aria-label="Faire un don"
        aria-current={location.pathname === '/donate' ? 'page' : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate('/donate');
          }
        }}
      >
        <span className="text-sm font-medium whitespace-nowrap">Faire un don</span>
        <div className="relative">
          <Heart 
            className="h-4 w-4 text-white fill-white transition-all duration-300 group-hover:fill-[#ea384c] group-hover:text-[#ea384c] group-hover:animate-[shake_0.5s_ease-in-out_infinite]" 
            aria-hidden="true" 
          />
          <motion.div
            initial="hidden"
            whileHover="visible"
            variants={heartBubbles}
            className="absolute -top-2 -left-2 w-8 h-8 pointer-events-none"
          >
            {[...Array(5)].map((_, i) => (
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
                  className="h-2 w-2 text-[#ea384c] fill-[#ea384c]" 
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