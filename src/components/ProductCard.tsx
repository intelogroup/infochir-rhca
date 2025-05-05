
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  badge?: string;
  color?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  icon,
  title,
  description,
  link,
  badge,
  color = "bg-gradient-to-br from-primary/5 to-primary/10",
}) => {
  return (
    <Link to={link}>
      <motion.div 
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="h-full"
      >
        <Card className={`group h-full border border-gray-200 hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden ${color}`}>
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm border border-white/20 text-primary">
                {icon}
              </div>
              {badge && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                  {badge}
                </Badge>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            
            <p className="text-gray-600 mb-4 flex-grow">
              {description}
            </p>
            
            <div className="mt-auto flex items-center text-primary font-medium">
              <span>Accéder</span>
              <motion.div
                initial={{ x: 0, opacity: 0.6 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="ml-2"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
