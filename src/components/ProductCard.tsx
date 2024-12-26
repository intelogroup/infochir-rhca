import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 h-full flex flex-col items-center"
    >
      <div className="relative z-10 flex items-center justify-center mb-6">
        {logo ? (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative h-28 w-28 overflow-hidden rounded-2xl shadow-lg transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            <img 
              src={logo} 
              alt={`${title} logo`} 
              className="w-full h-full object-contain bg-white/90 backdrop-blur-sm p-4" 
            />
          </motion.div>
        ) : (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative h-24 w-24 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 transition-all duration-300"
          >
            <Icon className="text-primary h-12 w-12" />
          </motion.div>
        )}
      </div>
      
      <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-3 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-600 text-sm text-center leading-relaxed max-w-[250px]">
        {description}
      </p>
    </motion.div>
  );

  const cardClasses = "group relative flex flex-col items-center rounded-2xl bg-white/80 px-6 py-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 backdrop-blur-sm hover:bg-white/95 overflow-hidden w-full h-full";

  if (onClick) {
    return (
      <motion.button 
        onClick={onClick} 
        className={cardClasses}
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent />
      </motion.button>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Link to={href || "#"} className={cardClasses}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent />
      </Link>
    </motion.div>
  );
};