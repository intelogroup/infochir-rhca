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
        className="w-20 h-20 object-contain"
      />
    );
  }

  return (
    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/5">
      <Icon className="text-primary h-10 w-10" />
    </div>
  );
};