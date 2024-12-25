import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  logo?: string;
}

export const ProductCard = ({ title, description, icon: Icon, logo }: ProductCardProps) => {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-4">
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
        <h3 className="text-xl font-semibold text-center">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-center">{description}</p>
      </CardContent>
    </Card>
  );
};