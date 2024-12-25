import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  logo?: string;
}

export const ProductCard = ({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  onClick,
  logo
}: ProductCardProps) => {
  const CardContent = () => (
    <>
      <div className="relative z-10 flex items-center justify-center mb-8">
        {logo ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-110">
            <img 
              src={logo} 
              alt={`${title} logo`} 
              className="w-full h-full object-contain" 
            />
          </div>
        ) : (
          <div className="relative h-16 w-16 flex items-center justify-center rounded-2xl bg-primary/5 transition-transform duration-300 group-hover:scale-110">
            <Icon className="text-primary h-8 w-8" />
          </div>
        )}
      </div>
      
      <h3 className="relative z-10 text-2xl font-semibold text-gray-900 mb-4 transition-colors duration-300 group-hover:text-primary">
        {title}
      </h3>
      
      <p className="relative z-10 text-gray-600 text-center leading-relaxed">
        {description}
      </p>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full group relative flex flex-col items-center rounded-2xl bg-white p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100/50 backdrop-blur-sm"
      >
        <CardContent />
      </button>
    );
  }

  return (
    <Link
      to={href || "#"}
      className="group relative flex flex-col items-center rounded-2xl bg-white p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100/50 backdrop-blur-sm"
    >
      <CardContent />
    </Link>
  );
};