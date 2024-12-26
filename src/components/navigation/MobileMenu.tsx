import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { navItems } from "@/config/navigation";
import { UserMenu } from "@/components/UserMenu";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
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

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute w-full border-b border-gray-200/50 bg-white/90 backdrop-blur-sm md:hidden"
    >
      <div className="space-y-1 px-4 pb-3 pt-2">
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            onClick={() => {
              navigate(item.href);
              onClose();
            }}
            className={`flex w-full items-center rounded-lg px-3 py-2 font-medium text-gray-700 transition-all duration-200 ${getHoverClass(item.href)}`}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.name}
          </motion.button>
        ))}
        <div className="py-2">
          <UserMenu />
        </div>
      </div>
    </motion.div>
  );
};