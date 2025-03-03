
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AtlasChapter } from "../types";

interface ModalContentProps {
  chapter: AtlasChapter;
}

export const ModalContent = ({ chapter }: ModalContentProps) => {
  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="prose prose-sm max-w-none"
      >
        {chapter.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{chapter.description}</p>
        )}
        {chapter.tags && chapter.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {chapter.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-0.5 bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
