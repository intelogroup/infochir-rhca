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
      className="relative z-10 h-full flex flex-col items-center justify-center p-6"
    >
      {logo ? (
        <motion.img 
          whileHover={{ scale: 1.05 }}
          src={logo} 
          alt={`${title} logo`} 
          className="w-24 h-24 object-contain mb-6 transition-all duration-300" 
        />
      ) : (
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="mb-6"
        >
          <Icon className="text-white h-12 w-12" />
        </motion.div>
      )}
      
      <h3 className="text-xl font-bold text-white mb-3 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-300 text-sm text-center leading-relaxed">
        {description}
      </p>
    </motion.div>
  );

  const cardClasses = "group relative flex flex-col items-center rounded-2xl bg-[#1A1F2C] px-6 py-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-800 hover:border-gray-700 overflow-hidden w-full h-full hover:bg-[#222632]";

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