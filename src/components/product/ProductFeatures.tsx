import { cn } from "@/lib/utils";

interface ProductFeaturesProps {
  features: string[];
  className?: string;
}

export const ProductFeatures = ({ features, className }: ProductFeaturesProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {features.slice(0, 3).map((feature, index) => (
        <div key={index} className="flex items-center gap-2 text-gray-600">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <span className="text-sm">{feature}</span>
        </div>
      ))}
    </div>
  );
};