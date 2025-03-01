
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
        className="w-28 h-28 object-contain"
      />
    );
  }

  return (
    <div className="w-28 h-28 flex items-center justify-center rounded-full bg-primary/5">
      <Icon className="text-primary h-14 w-14" />
    </div>
  );
};
