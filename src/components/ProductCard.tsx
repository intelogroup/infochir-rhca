import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  logo?: string;
}

export const ProductCard = ({ title, description, icon: Icon, logo }: ProductCardProps) => {
  return (
    <Card className="h-full bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
      <CardHeader className="space-y-4 text-center">
        {logo ? (
          <div className="w-16 h-16 mx-auto">
            <img 
              src={logo} 
              alt={`${title} logo`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <Icon className="w-12 h-12 mx-auto text-primary" />
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-center">{description}</p>
      </CardContent>
    </Card>
  );
};