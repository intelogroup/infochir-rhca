import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { navItems } from "@/config/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-20 left-0 right-0 w-full bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50 md:hidden z-[100]"
    >
      <div className="space-y-2 p-6">
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            onClick={() => {
              navigate(item.href);
              onClose();
            }}
            className="flex w-full items-center rounded-lg px-4 py-3 font-medium transition-all duration-200 hover:bg-gray-50/80"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="bg-gradient-to-br from-[#1E40AF] via-[#41b06e] to-[#41b06e] bg-clip-text text-transparent text-lg">
              {item.name}
            </span>
          </motion.button>
        ))}
        <motion.button
          onClick={() => {
            navigate('/donate');
            onClose();
          }}
          className="flex w-full items-center rounded-lg px-4 py-3 font-medium bg-gradient-to-r from-secondary to-secondary-light text-white hover:opacity-90 transition-all duration-200"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">Faire un don</span>
        </motion.button>
      </div>
    </motion.div>
  );
};