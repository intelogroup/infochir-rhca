import { useNavigate } from "react-router-dom";
import { navItems } from "./NavItems";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-sm border-b border-gray-200/50 animate-fade-up">
      <div className="px-4 pt-2 pb-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              navigate(item.href);
              onClose();
            }}
            className="w-full text-left px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors duration-200 flex flex-col"
          >
            <span className="font-medium">{item.name}</span>
            <span className="text-sm text-gray-500">{item.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};