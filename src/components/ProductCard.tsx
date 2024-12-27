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
}

export const ProductCard = ({ 
  title, 
  description, 
  icon, 
  href, 
  onClick,
  logo,
  features = []
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
      return "hover:bg-green-800/90";
    }
    return "hover:bg-primary/90";
  };

  const shouldShowBadge = (title: string) => {
    return title !== "Index Medicus";
  };

  const CardComponent = () => (
    <div className="h-full perspective-1000">
      <Card className="group h-full relative overflow-hidden border-0 transition-all duration-500 transform-gpu hover:scale-[1.02]">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C]/80 to-[#243949]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-[2px] group-hover:backdrop-blur-[4px] transition-all duration-500" />
        
        <div className="relative z-10">
          <CardHeader className="space-y-4">
            {shouldShowBadge(title) && (
              <div className="absolute top-0 right-0 p-4">
                <ProductBadge />
              </div>
            )}
            <div className="flex justify-center pt-6 transform-gpu group-hover:scale-105 transition-transform duration-500">
              <ProductIcon icon={icon} logo={logo} title={title} />
            </div>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-center">
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-center leading-relaxed line-clamp-2 h-12">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProductFeatures features={getProductFeatures(title)} />
          </CardContent>
          <CardFooter className="pt-4">
            <Button 
              variant="ghost" 
              className={`w-full group/button relative overflow-hidden bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white opacity-90 hover:opacity-100 ${getHoverColor(title)}`}
            >
              <span className="relative z-10 group-hover/button:scale-105 transition-transform duration-300">
                Découvrir
              </span>
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full"><CardComponent /></button>;
  }

  return <Link to={href || "#"} className="block w-full"><CardComponent /></Link>;
};