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
        className="w-28 h-28 object-contain" // Increased from w-20 h-20
      />
    );
  }

  return (
    <div className="w-28 h-28 flex items-center justify-center rounded-full bg-primary/5"> // Increased from w-20 h-20
      <Icon className="text-primary h-14 w-14" /> // Increased from h-10 w-10
    </div>
  );
};