import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { navItems } from "@/config/navigation";

export const NavLinks = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-4">
      {navItems.map((item) => (
        <motion.button
          key={item.name}
          onClick={() => navigate(item.href)}
          className="flex h-10 w-auto px-4 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 text-primary hover:from-primary/20 hover:to-secondary/20 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm font-medium">{item.name}</span>
        </motion.button>
      ))}
    </div>
  );
};