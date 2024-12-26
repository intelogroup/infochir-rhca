import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { navItems } from "@/config/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();

  const getGradientClass = (href: string) => {
    if (href === '/rhca' || href === '/adc') {
      return 'bg-gradient-to-r from-[#F97316] to-[#D946EF] hover:from-[#F97316]/90 hover:to-[#D946EF]/90';
    }
    if (href === '/igm' || href === '/index-medicus') {
      return 'bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] hover:from-[#0EA5E9]/90 hover:to-[#8B5CF6]/90';
    }
    return 'bg-gradient-to-r from-[#6E59A5] to-[#9b87f5] hover:from-[#6E59A5]/90 hover:to-[#9b87f5]/90';
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-20 left-0 right-0 w-full bg-white shadow-lg border-b border-gray-200/50 md:hidden z-[9999]"
    >
      <div className="space-y-1 px-4 py-3">
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            onClick={() => {
              navigate(item.href);
              onClose();
            }}
            className="flex w-full items-center rounded-lg px-4 py-3 font-medium transition-all duration-200"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={`${getGradientClass(item.href)} bg-clip-text text-transparent`}>
              {item.name}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};