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
        <div className="relative w-full mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-10 h-9 w-full bg-white/50 border-gray-200/50 focus:border-primary/50 focus:ring-primary/50"
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
          <Heart className="h-5 w-5 text-[#1EAEDB] fill-[#1EAEDB]" />
        </motion.button>
      </div>
    </motion.div>
  );
};