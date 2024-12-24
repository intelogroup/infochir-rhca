import { LucideIcon } from "lucide-react";

interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  logo?: string;
}

export const ProductCard = ({ title, description, icon: Icon, href, logo }: ProductCardProps) => {
  return (
    <a
      href={href}
      className="group relative overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {logo ? (
        <div className="relative h-24 w-24 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
          <img 
            src={logo} 
            alt={`${title} logo`} 
            className={`w-full h-full object-contain ${title === 'Index Medicus' ? 'scale-125' : ''}`} 
          />
        </div>
      ) : (
        <div className="relative h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="text-primary h-6 w-6" />
        </div>
      )}
      
      <h3 className="relative text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
        {title}
      </h3>
      
      <p className="relative text-gray-600">
        {description}
      </p>
    </a>
  );
};