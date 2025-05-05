
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductBadge } from "./product/ProductBadge";
import { ProductIcon } from "./product/ProductIcon";
import { ProductFeatures } from "./product/ProductFeatures";
import { motion } from "framer-motion";

interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  logo?: string;
  features?: string[];
  fullName?: string;
  link?: string;
}

export const ProductCard = ({ 
  title, 
  description, 
  icon, 
  href, 
  onClick,
  logo,
  features = [],
  fullName,
  link
}: ProductCardProps) => {
  const getProductFeatures = (title: string) => {
    switch (title) {
      case "RHCA":
        return ["Publication d'articles", "Diffusion des connaissances", "Communauté médicale"];
      case "IGM":
        return ["Actualités médicales", "Tendances cliniques", "Perspective unique sur la médecine"];
      case "Atlas ADC":
        return ["Documentation illustrée", "Guide de diagnostic", "Accessible en ligne 24/7"];
      case "Index Medicus":
        return ["Repérer par auteur", "Repérer par titre", "Base de données scientifique"];
      default:
        return features;
    }
  };

  const getHoverColor = (title: string) => {
    if (title === "Atlas ADC" || title === "RHCA") {
      return "hover:bg-[#41b06e]/90";
    }
    return "hover:bg-[#1E40AF]/90";
  };

  const shouldShowBadge = (title: string) => {
    return true; // Now showing badge on all cards, including Index Medicus
  };

  // Get the full display name for the product
  const getFullProductName = (title: string) => {
    if (fullName) return fullName;
    
    switch (title) {
      case "RHCA":
        return "Revue Haïtienne de Chirurgie et d'Anesthésiologie";
      case "IGM":
        return "Info Gazette Médicale";
      case "Atlas ADC":
        return "Atlas de Diagnostic Chirurgical";
      case "Index Medicus":
        return "Index Medicus";
      default:
        return title;
    }
  };

  const CardComponent = () => (
    <motion.div 
      className="h-[440px] perspective-1000"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="group h-full relative overflow-hidden border-0 flex flex-col">
        {/* Gradient background overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#1E40AF]/80 via-[#41b06e]/70 to-[#41b06e]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
        
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-[2px] group-hover:backdrop-blur-[4px] transition-all duration-500" />
        
        <div className="relative z-10 flex flex-col h-full p-6">
          <CardHeader className="space-y-3 flex-shrink-0 pb-2 p-0">
            {shouldShowBadge(title) && (
              <motion.div 
                className="absolute top-0 right-0 p-3"
                whileHover={{ rotate: 5 }}
              >
                <ProductBadge />
              </motion.div>
            )}
            <motion.div 
              className="flex justify-center h-20 mb-4"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {logo ? (
                <img 
                  src={logo} 
                  alt={`${title} logo`} 
                  className="object-contain h-16 w-auto max-w-full"
                />
              ) : (
                <ProductIcon icon={icon} logo={logo} title={title} />
              )}
            </motion.div>
            <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1E40AF] via-[#41b06e] to-[#41b06e] text-left truncate min-h-[2rem] flex items-center">
              {getFullProductName(title)}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-left text-sm leading-tight line-clamp-2 min-h-[2.75rem] mt-2">
              {description}
            </CardDescription>
          </CardHeader>
          
          <div className="flex-grow mt-3 mb-4 overflow-hidden">
            <ProductFeatures features={getProductFeatures(title)} />
          </div>
          
          <div className="mt-auto pt-2">
            <Button 
              variant="ghost" 
              className={`w-full group/button relative overflow-hidden bg-gradient-to-r from-[#1E40AF] via-[#41b06e] to-[#41b06e] text-white opacity-90 hover:opacity-100 ${getHoverColor(title)}`}
            >
              <motion.span 
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Découvrir
              </motion.span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full"><CardComponent /></button>;
  }

  return <Link to={href || link || "#"} className="block w-full"><CardComponent /></Link>;
};
