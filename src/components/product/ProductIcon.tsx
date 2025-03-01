
import { LucideIcon } from "lucide-react";

interface ProductIconProps {
  icon: LucideIcon;
  logo?: string;
  title: string;
}

export const ProductIcon = ({ icon: Icon, logo, title }: ProductIconProps) => {
  if (logo) {
    return (
      <img 
        src={logo} 
        alt={`${title} logo`} 
        className="w-38 h-38 object-contain" // Increased from w-28 h-28 by 10px
      />
    );
  }

  return (
    <div className="w-38 h-38 flex items-center justify-center rounded-full bg-primary/5"> // Increased from w-28 h-28
      <Icon className="text-primary h-16 w-16" /> // Increased from h-14 w-14
    </div>
  );
};
