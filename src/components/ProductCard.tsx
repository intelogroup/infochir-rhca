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
      className="group relative flex flex-col items-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 transition-all duration-300 hover:bg-white/20 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-center justify-center mb-6">
        {logo ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-110">
            <img 
              src={logo} 
              alt={`${title} logo`} 
              className="w-full h-full object-contain" 
            />
          </div>
        ) : (
          <div className="relative h-16 w-16 flex items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
            <Icon className="text-primary h-8 w-8" />
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-primary/90 mb-3 transition-colors duration-300 group-hover:text-primary">
        {title}
      </h3>
      
      <p className="text-gray-600/90 text-center leading-relaxed">
        {description}
      </p>
    </a>
  );
};