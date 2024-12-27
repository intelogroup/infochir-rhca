import { FileText, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface FileListProps {
  files: string[];
  onRemove: (url: string) => void;
  isUploading: boolean;
  type?: 'document' | 'image';
}

export const FileList = ({ files, onRemove, isUploading, type = 'document' }: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <ul className="space-y-2">
      <AnimatePresence>
        {files.map((url, index) => (
          <motion.li 
            key={url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              {type === 'image' ? (
                <ImageIcon className="h-4 w-4 text-secondary" />
              ) : (
                <FileText className="h-4 w-4 text-secondary" />
              )}
              <span className="text-sm truncate max-w-[200px]">
                {type === 'image' ? `Image ${index + 1}` : `Fichier ${index + 1}`}
              </span>
              {isUploading && (
                <Loader2 className="h-3 w-3 animate-spin text-secondary ml-2" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(url)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};