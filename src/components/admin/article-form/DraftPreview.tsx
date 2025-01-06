import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DraftPreviewProps {
  title: string;
  abstract: string;
  onSaveDraft: () => void;
}

export const DraftPreview = ({ title, abstract, onSaveDraft }: DraftPreviewProps) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          {isPreviewMode ? "Éditer" : "Aperçu"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveDraft}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Sauvegarder le brouillon
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isPreviewMode ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{abstract}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};