import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  logo?: string;
  bgImage?: string;
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
      <div className="relative z-10 flex items-center justify-center mb-6">
        {logo ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110">
            <img 
              src={logo} 
              alt={`${title} logo`} 
              className="w-full h-full object-contain bg-white p-2" 
            />
          </div>
        ) : (
          <div className="relative h-20 w-20 flex items-center justify-center rounded-xl bg-primary/5 transition-transform duration-300 group-hover:scale-110">
            <Icon className="text-primary h-10 w-10" />
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-primary">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center leading-relaxed">
        {description}
      </p>
    </>
  );

  const cardClasses = "group relative flex flex-col items-center rounded-2xl bg-white p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100/50 backdrop-blur-sm bg-white/50";

  if (onClick) {
    return (
      <button onClick={onClick} className={cardClasses}>
        <CardContent />
      </button>
    );
  }

  return (
    <Link to={href || "#"} className={cardClasses}>
      <CardContent />
    </Link>
  );
};