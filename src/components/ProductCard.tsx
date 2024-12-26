import { LucideIcon, ArrowRight } from "lucide-react";
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
        return ["Publication d'articles scientifiques", "Diffusion des connaissances", "Communauté médicale engagée"];
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
      return "hover:bg-green-800";
    }
    return "hover:bg-primary";
  };

  const CardComponent = () => (
    <div className="h-full">
      <Card className="group h-full bg-[#f6ffff] hover:shadow-xl transition-all duration-300 border border-gray-200/50 overflow-hidden">
        <CardHeader className="space-y-4 relative">
          <div className="absolute top-0 right-0 p-4">
            <ProductBadge />
          </div>
          <div className="flex justify-center pt-6">
            <ProductIcon icon={icon} logo={logo} title={title} />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 text-center group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 text-center leading-relaxed line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductFeatures features={getProductFeatures(title)} />
        </CardContent>
        <CardFooter className="pt-4">
          <Button 
            variant="ghost" 
            className={`w-full group/button hover:text-white transition-all duration-300 ${getHoverColor(title)}`}
          >
            <span>Découvrir</span>
            <ArrowRight className="w-4 h-4 ml-2" />
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