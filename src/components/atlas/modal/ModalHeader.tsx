
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AtlasCategory } from "../data/atlasCategories";
import { AtlasChapter } from "../types";
import { Calendar, User, ImageOff } from "lucide-react";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('ModalHeader');

interface ModalHeaderProps {
  chapter: AtlasChapter;
  category?: AtlasCategory;
}

export const ModalHeader = ({ chapter, category }: ModalHeaderProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(chapter.coverImage || '');
  
  // Effect to handle image validation
  useEffect(() => {
    // Reset state when chapter changes
    setImageSrc(chapter.coverImage || '');
    setIsImageLoading(true);
    setImageError(false);
    
    if (!chapter.coverImage) {
      setImageError(true);
      setIsImageLoading(false);
    }
    
    logger.log(`[ModalHeader] Image URL for chapter ${chapter.id}: ${chapter.coverImage}`);
  }, [chapter.coverImage, chapter.id]);

  // Handle image loading events
  const handleImageLoad = () => {
    logger.log(`[ModalHeader] Image loaded successfully for chapter: ${chapter.id}`);
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    logger.error(`[ModalHeader] Image failed to load for chapter: ${chapter.id}, URL: ${imageSrc}`);
    setImageError(true);
    setIsImageLoading(false);
  };
  
  return (
    <div className="relative">
      <div className="relative h-40 overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse h-full w-full bg-gray-200"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Image unavailable</span>
          </div>
        ) : (
          <ImageOptimizer
            src={imageSrc}
            alt={chapter.title}
            width={800}
            height={320}
            className="w-full h-full object-cover object-top"
            priority={true}
            fallbackText={chapter.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
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
          {chapter.lastUpdated && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>MàJ: {chapter.lastUpdated}</span>
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
