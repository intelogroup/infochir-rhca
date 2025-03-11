
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { AtlasCategory } from "../data/atlasCategories";
import { AtlasChapter } from "../types";
import { Calendar, User } from "lucide-react";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";

interface ModalHeaderProps {
  chapter: AtlasChapter;
  category?: AtlasCategory;
}

export const ModalHeader = ({ chapter, category }: ModalHeaderProps) => {
  // Use the chapter's cover image if available
  const coverImage = chapter.coverImage || '';
  
  return (
    <div className="relative">
      <div className="relative h-40 overflow-hidden">
        <ImageOptimizer
          src={coverImage}
          alt={chapter.title}
          width={800}
          height={320}
          className="w-full h-full object-cover"
          priority={true}
          fallbackText={chapter.title}
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
