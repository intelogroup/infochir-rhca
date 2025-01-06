import { Calendar, User, Tag } from "lucide-react";
import { AtlasChapter } from "../types";
import { motion } from "framer-motion";

interface AtlasModalMetadataProps {
  chapter: AtlasChapter;
}

export const AtlasModalMetadata = ({ chapter }: AtlasModalMetadataProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {chapter.lastUpdate && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-gray-600 shadow-sm"
          >
            <Calendar className="h-4 w-4" />
            <span>MàJ: {chapter.lastUpdate}</span>
          </motion.div>
        )}
        {chapter.author && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-gray-600 shadow-sm"
          >
            <User className="h-4 w-4" />
            <span>{chapter.author}</span>
          </motion.div>
        )}
        {chapter.status === "coming" && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm shadow-sm"
          >
            <Tag className="h-4 w-4" />
            <span>À venir</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};