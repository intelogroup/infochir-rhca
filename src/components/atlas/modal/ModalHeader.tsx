
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { AtlasCategory } from "../data/atlasCategories";
import { AtlasChapter } from "../types";
import { Calendar, User } from "lucide-react";

interface ModalHeaderProps {
  chapter: AtlasChapter;
  category?: AtlasCategory;
}

export const ModalHeader = ({ chapter, category }: ModalHeaderProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const defaultCoverImage = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&fit=crop";
  const coverImage = chapter.coverImage || defaultCoverImage;
  // Optimize the cover image for the modal header
  const optimizedCoverImage = `${coverImage}?w=800&h=320&fit=cover&q=80`;
  
  return (
    <div className="relative">
      <div className="relative h-40 overflow-hidden">
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <img
          src={optimizedCoverImage}
          alt={chapter.title}
          width={800}
          height={320}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-0 left-0 right-0 p-4 text-white"
      >
        {category && (
          <Badge variant="secondary" className="mb-2 text-xs backdrop-blur-sm bg-white/10">
            <BookOpen className="w-3 h-3 mr-1" />
            {category.title}
          </Badge>
        )}
        <h2 className="text-xl font-bold mb-2">{chapter.title}</h2>
        <div className="flex flex-wrap gap-3 text-xs">
          {chapter.lastUpdate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>MàJ: {chapter.lastUpdate}</span>
            </div>
          )}
          {chapter.author && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{chapter.author}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
