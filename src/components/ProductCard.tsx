import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  logo?: string;
  bgImage?: string;
  features?: string[];
}

export const ProductCard = ({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  onClick,
  logo,
  features = []
}: ProductCardProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getProductFeatures = (title: string) => {
    switch (title) {
      case "RHCA":
        return [
          "Publication d'articles scientifiques",
          "Diffusion des connaissances",
          "Communauté médicale engagée"
        ];
      case "IGM":
        return [
          "Actualités médicales",
          "Tendances cliniques",
          "Perspective unique sur la médecine"
        ];
      case "Atlas ADC":
        return [
          "Documentation illustrée",
          "Guide de diagnostic",
          "Accessible en ligne 24/7"
        ];
      case "Index Medicus":
        return [
          "Recherche par auteur/thème",
          "Base de données scientifique",
          "Références académiques"
        ];
      default:
        return features;
    }
  };

  const CardComponent = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="group h-full bg-white hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
        <CardHeader className="space-y-4 relative">
          <div className="absolute top-0 right-0 p-4">
            <Badge 
              variant="secondary" 
              className="bg-primary/5 text-primary flex items-center gap-2"
            >
              <span>Mise à jour disponible</span>
              {isAnimating && (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1,
                    repeat: 2,
                    repeatType: "reverse"
                  }}
                >
                  <Bell className="w-4 h-4" />
                </motion.div>
              )}
            </Badge>
          </div>
          <div className="flex justify-center pt-6">
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
          <CardTitle className="text-2xl font-bold text-gray-900 text-center group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 text-center leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {getProductFeatures(title).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button 
            variant="ghost" 
            className="w-full group/button hover:bg-primary hover:text-white transition-all duration-300"
          >
            <span>Découvrir</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/button:translate-x-1" />
          </Button>
        </CardFooter>
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
        <CardComponent />
      </motion.button>
    );
  }

  return (
    <Link to={href || "#"} className="block w-full">
      <motion.div whileHover={{ scale: 1.02 }}>
        <CardComponent />
      </motion.div>
    </Link>
  );
};