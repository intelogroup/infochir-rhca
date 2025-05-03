
import { X, FileIcon, ImageIcon, FileCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

interface FileListProps {
  files: string[];
  onRemove: (url: string) => void;
  isUploading: boolean;
  type?: 'document' | 'image';
}

export const FileList = ({ files, onRemove, isUploading, type = 'document' }: FileListProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (files.length === 0) return null;

  const getFileName = (url: string) => {
    const parts = url.split('/');
    const fullName = parts[parts.length - 1];
    
    // If the filename is very long, truncate it
    if (fullName.length > 30) {
      const extension = fullName.split('.').pop() || '';
      const nameWithoutExt = fullName.substring(0, fullName.length - extension.length - 1);
      return `${nameWithoutExt.substring(0, 25)}...${extension ? `.${extension}` : ''}`;
    }
    
    return decodeURIComponent(fullName);
  };

  const handlePreview = (url: string) => {
    if (type === 'image') {
      setPreviewUrl(previewUrl === url ? null : url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <motion.div 
          key={file}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-card border rounded-md p-2 flex items-center justify-between group"
        >
          <div 
            className="flex items-center space-x-2 flex-1 cursor-pointer overflow-hidden"
            onClick={() => handlePreview(file)}
          >
            {type === 'document' ? (
              <FileCheck className="h-5 w-5 text-primary flex-shrink-0" />
            ) : (
              <ImageIcon className="h-5 w-5 text-primary flex-shrink-0" />
            )}
            <span className="text-sm truncate" title={getFileName(file)}>
              {getFileName(file)}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(file)}
            disabled={isUploading}
            className="h-7 w-7 opacity-50 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span className="sr-only">Retirer le fichier</span>
          </Button>
        </motion.div>
      ))}
      
      {previewUrl && type === 'image' && (
        <div className="mt-4">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-h-64 rounded-md mx-auto border shadow-sm"
          />
        </div>
      )}
    </div>
  );
};
