import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface CardHeaderProps {
  image: string;
  title: string;
  category?: string;
}

export const CardHeader = ({ image, title, category }: CardHeaderProps) => {
  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      <motion.img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">
        {category || 'Article'}
      </Badge>
    </div>
  );
};