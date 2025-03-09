
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
        className="h-16 w-auto object-contain max-w-full" 
      />
    );
  }

  return (
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/5">
      <Icon className="text-primary h-8 w-8" />
    </div>
  );
};
