import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { navItems } from "@/config/navigation";

export const NavLinks = () => {
  const navigate = useNavigate();

  const getHoverClass = (href: string) => {
    if (href === '/rhca' || href === '/adc') {
      return 'hover:bg-secondary hover:text-white';
    }
    if (href === '/igm' || href === '/index-medicus') {
      return 'hover:bg-primary hover:text-white';
    }
    return 'hover:text-primary hover:bg-gray-100/80';
  };

  return (
    <div className="flex items-center space-x-1">
      {navItems.map((item) => (
        <motion.button
          key={item.name}
          onClick={() => navigate(item.href)}
          className={`relative overflow-hidden rounded-md px-4 py-2 font-medium text-gray-700 transition-all duration-300 ${getHoverClass(item.href)}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">{item.name}</span>
          <motion.div
            className="absolute inset-0 -z-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 transition-opacity duration-300"
            initial={false}
            whileHover={{ opacity: 1 }}
          />
        </motion.button>
      ))}
    </div>
  );
};