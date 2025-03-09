
import { motion } from "framer-motion";
import { Highlight } from "./carouselData";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";

interface CarouselCardProps {
  highlight: Highlight;
  index: number;
}

export const CarouselCard = ({ highlight, index }: CarouselCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl overflow-hidden bg-white shadow-md h-full flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <ImageOptimizer
          src={highlight.image}
          alt={highlight.title}
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="backdrop-blur-sm bg-white/10">
            {highlight.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{highlight.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
          {highlight.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{highlight.date}</span>
            </div>
            {highlight.author && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{highlight.author}</span>
              </div>
            )}
          </div>
          
          <Link 
            to={highlight.link}
            className="text-sm font-medium text-primary hover:underline inline-block"
          >
            Lire l'article →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
