
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileItem } from "./FileItem";
import { ImagePreview } from "./ImagePreview";

interface FileListProps {
  files: string[];
  onRemove: (url: string) => void;
  isUploading: boolean;
  type?: 'document' | 'image';
}

export const FileList = ({ 
  files, 
  onRemove, 
  isUploading, 
  type = 'document' 
}: FileListProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (files.length === 0) return null;

  const handlePreview = (url: string) => {
    if (type === 'image') {
      setPreviewUrl(previewUrl === url ? null : url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {files.map((file) => (
          <FileItem
            key={file}
            file={file}
            type={type}
            isUploading={isUploading}
            onRemove={onRemove}
            onPreview={handlePreview}
          />
        ))}
      </AnimatePresence>
      
      <ImagePreview url={type === 'image' ? previewUrl : null} />
    </div>
  );
};
