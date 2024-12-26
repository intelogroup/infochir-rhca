import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      className="h-full"
    >
      <Card className="group h-full bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            {logo ? (
              <motion.img 
                whileHover={{ scale: 1.05 }}
                src={logo} 
                alt={`${title} logo`} 
                className="w-20 h-20 object-contain transition-all duration-300" 
              />
            ) : (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/5"
              >
                <Icon className="text-primary h-10 w-10" />
              </motion.div>
            )}
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 text-center group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 text-center leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );

  if (onClick) {
    return (
      <motion.button 
        onClick={onClick} 
        className="w-full"
        whileHover={{ scale: 1.02 }}
      >
        <CardContent />
      </motion.button>
    );
  }

  return (
    <Link to={href || "#"} className="block w-full">
      <motion.div whileHover={{ scale: 1.02 }}>
        <CardContent />
      </motion.div>
    </Link>
  );
};