import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { navItems } from "@/config/navigation";
import { Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearch: (value: string) => void;
}

export const MobileMenu = ({ isOpen, onClose, searchQuery, onSearch }: MobileMenuProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-20 left-0 right-0 w-full bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50 md:hidden z-[100]"
    >
      <div className="space-y-4 p-6">
        <div className="relative flex items-center bg-gray-50/80 rounded-lg p-2">
          <Search className="h-4 w-4 text-gray-400 ml-2" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Rechercher..."
            className="border-0 bg-transparent focus:ring-0 pl-2"
          />
        </div>
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
          className="flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium bg-gradient-to-r from-secondary to-secondary-light text-white hover:opacity-90 transition-all duration-200"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">Faire un don</span>
          <Heart className="h-5 w-5 text-white fill-white" />
        </motion.button>
      </div>
    </motion.div>
  );
};