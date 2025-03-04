
import { Badge } from "@/components/ui/badge";
import { motion as Motion } from "framer-motion";

interface CardHeaderProps {
  image: string;
  title: string;
  category?: string;
}

export const CardHeader = ({ image, title, category }: CardHeaderProps) => {
  return (
    <div className="relative min-h-[160px] max-h-[200px] w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <Motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center"
          style={{
            objectFit: "cover"
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">
        {category || 'Article'}
      </Badge>
    </div>
  );
};
