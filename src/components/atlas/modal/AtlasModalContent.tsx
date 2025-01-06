import { Book, Info, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AtlasChapter } from "../types";
import { motion } from "framer-motion";

interface AtlasModalContentProps {
  chapter: AtlasChapter;
}

export const AtlasModalContent = ({ chapter }: AtlasModalContentProps) => {
  return (
    <div className="space-y-8">
      {chapter.description && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-primary">
            <Info className="h-5 w-5" />
            <h3 className="text-lg font-semibold">À propos de ce chapitre</h3>
          </div>
          <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm">
            {chapter.description}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-primary">
          <Book className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Contenu du chapitre</h3>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-600 leading-relaxed">
            Ce chapitre fait partie de l'Atlas de Diagnostic Chirurgical, 
            un guide complet conçu pour les professionnels de santé. 
            Il contient des informations détaillées, des illustrations et 
            des protocoles cliniques.
          </p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {chapter.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};