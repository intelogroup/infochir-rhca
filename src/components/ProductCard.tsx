
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductBadge } from "./product/ProductBadge";
import { ProductIcon } from "./product/ProductIcon";
import { ProductFeatures } from "./product/ProductFeatures";

interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  logo?: string;
  features?: string[];
  fullName?: string;
}

export const ProductCard = ({ 
  title, 
  description, 
  icon, 
  href, 
  onClick,
  logo,
  features = [],
  fullName
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

  const getLogoSize = (title: string) => {
    if (title === "Index Medicus") {
      return "h-14 w-14"; // Smaller size for Index Medicus
    }
    if (title === "RHCA") {
      return "h-20 w-20"; // Larger size for RHCA
    }
    return "h-16 w-16"; // Default size for other logos
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
    <div className="h-[440px] perspective-1000">
      <Card className="group h-full relative overflow-hidden border-0 transition-all duration-500 transform-gpu hover:scale-[1.02] flex flex-col">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF]/80 via-[#41b06e]/70 to-[#41b06e]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-[2px] group-hover:backdrop-blur-[4px] transition-all duration-500" />
        
        <div className="relative z-10 flex flex-col h-full p-6">
          <CardHeader className="space-y-3 flex-shrink-0 pb-2 p-0">
            {shouldShowBadge(title) && (
              <div className="absolute top-0 right-0 p-3">
                <ProductBadge />
              </div>
            )}
            <div className="flex justify-center transform-gpu group-hover:scale-105 transition-transform duration-500">
              {logo ? (
                <img 
                  src={logo} 
                  alt={`${title} logo`} 
                  className={`object-contain ${getLogoSize(title)}`}
                />
              ) : (
                <ProductIcon icon={icon} logo={logo} title={title} />
              )}
            </div>
            <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1E40AF] via-[#41b06e] to-[#41b06e] text-center truncate">
              {getFullProductName(title)}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-center text-sm leading-tight line-clamp-2 min-h-[2.5rem] mt-1">
              {description}
            </CardDescription>
          </CardHeader>
          
          <div className="flex-grow mt-2 mb-4 overflow-hidden">
            <ProductFeatures features={getProductFeatures(title)} />
          </div>
          
          <div className="mt-auto pt-2">
            <Button 
              variant="ghost" 
              className={`w-full group/button relative overflow-hidden bg-gradient-to-r from-[#1E40AF] via-[#41b06e] to-[#41b06e] text-white opacity-90 hover:opacity-100 ${getHoverColor(title)}`}
            >
              <span className="relative z-10 group-hover/button:scale-105 transition-transform duration-300">
                Découvrir
              </span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full"><CardComponent /></button>;
  }

  return <Link to={href || "#"} className="block w-full"><CardComponent /></Link>;
};
