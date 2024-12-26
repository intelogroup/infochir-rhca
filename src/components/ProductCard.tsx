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
      <div className="relative z-10 flex items-center justify-center mb-8 group">
        {logo ? (
          <div className="relative h-28 w-28 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src={logo} 
              alt={`${title} logo`} 
              className="w-full h-full object-contain bg-white p-3" 
            />
          </div>
        ) : (
          <div className="relative h-24 w-24 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="text-primary h-12 w-12 transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center leading-relaxed">
        {description}
      </p>
    </>
  );

  const cardClasses = `
    group relative flex flex-col items-center rounded-3xl 
    bg-white/50 backdrop-blur-sm p-8 
    border border-gray-100/50 
    transition-all duration-500 
    hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] 
    hover:-translate-y-2 
    before:absolute before:inset-0 
    before:bg-gradient-to-br before:from-primary/[0.02] before:to-secondary/[0.02] 
    before:opacity-0 before:transition-opacity before:duration-500 
    hover:before:opacity-100
  `;

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