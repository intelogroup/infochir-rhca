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

  const getFileName = (url: string) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    // Remove the timestamp prefix if it exists
    return fileName.includes('_') ? fileName.split('_').slice(1).join('_') : fileName;
  };

  return (
    <ul className="space-y-2">
      <AnimatePresence>
        {files.map((url, index) => (
          <motion.li 
            key={url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              {type === 'image' ? (
                <ImageIcon className="h-4 w-4 text-secondary flex-shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-secondary flex-shrink-0" />
              )}
              <span className="text-sm truncate">
                {getFileName(url)}
              </span>
              {isUploading && (
                <Loader2 className="h-3 w-3 animate-spin text-secondary ml-2 flex-shrink-0" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(url)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
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