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
      <Card className="group h-full bg-gradient-to-br from-white/90 to-gray-50/80 hover:shadow-2xl transition-all duration-500 border border-gray-200/30 overflow-hidden backdrop-blur-sm transform-gpu hover:scale-[1.02] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="space-y-4 relative">
          {shouldShowBadge(title) && (
            <div className="absolute top-0 right-0 p-4">
              <ProductBadge />
            </div>
          )}
          <div className="flex justify-center pt-6 transform-gpu group-hover:scale-105 transition-transform duration-500">
            <ProductIcon icon={icon} logo={logo} title={title} />
          </div>
          <CardTitle className="text-2xl font-bold text-primary/90 text-center group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 text-center leading-relaxed line-clamp-2 h-12 group-hover:text-gray-700 transition-colors">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductFeatures features={getProductFeatures(title)} />
        </CardContent>
        <CardFooter className="pt-4">
          <Button 
            variant="ghost" 
            className={`w-full group/button relative overflow-hidden ${getHoverColor(title)}`}
          >
            <span className="relative z-10 text-primary group-hover/button:text-white transition-colors duration-300">
              Découvrir
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary transform translate-x-full group-hover/button:translate-x-0 transition-transform duration-500" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full"><CardComponent /></button>;
  }

  return <Link to={href || "#"} className="block w-full"><CardComponent /></Link>;
};