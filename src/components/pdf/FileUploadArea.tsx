
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { UploadIcon } from "./upload/UploadIcon";
import { UploadInstructions } from "./upload/UploadInstructions";
import { UploadingState } from "./upload/UploadingState";

interface FileUploadAreaProps {
  acceptedFileTypes: Record<string, string[]>;
  isUploading: boolean;
  onFileSelect: (files: File[]) => void;
  helperText?: string;
  maxFiles: number;
  currentFileCount: number;
  type?: 'document' | 'image';
}

export const FileUploadArea = ({
  acceptedFileTypes,
  isUploading,
  onFileSelect,
  helperText,
  maxFiles,
  currentFileCount,
  type = 'document'
}: FileUploadAreaProps) => {
  const isMobile = useIsMobile();
  const [isDragActive, setIsDragActive] = useState(false);

  const handlePaste = useCallback((event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }

    if (files.length > 0) {
      if (currentFileCount + files.length > maxFiles) {
        toast.error(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers`);
        return;
      }
      onFileSelect(files);
      toast.success(`${files.length} fichier(s) collé(s) avec succès`);
    }
  }, [onFileSelect, maxFiles, currentFileCount]);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        // Create a detailed error message for each rejected file
        rejectedFiles.forEach(rejection => {
          const fileSizeMB = (rejection.file.size / (1024 * 1024)).toFixed(2);
          
          if (rejection.errors.some(e => e.code === 'file-too-large')) {
            toast.error(`${rejection.file.name} (${fileSizeMB} MB) dépasse la limite de 30MB`);
          } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
            toast.error(`${rejection.file.name} n'est pas un format accepté`);
          } else {
            toast.error(`Impossible d'uploader ${rejection.file.name}: ${rejection.errors[0].message}`);
          }
        });
      }
      
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles);
      }
    },
    accept: acceptedFileTypes,
    disabled: isUploading || currentFileCount >= maxFiles,
    maxFiles: maxFiles - currentFileCount,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => {
      setIsDragActive(false);
      toast.success("Fichiers acceptés");
    },
    onDropRejected: () => {
      setIsDragActive(false);
    },
    maxSize: 30 * 1024 * 1024 // 30MB in bytes
  });

  // Add paste event listener
  useState(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        transition-all duration-200 
        ${isDragActive ? 'border-secondary bg-secondary/5' : 'border-gray-300 hover:bg-gray-50'} 
        ${isUploading ? 'bg-gray-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} capture={isMobile && type === 'image' ? "environment" : undefined} />
      {isUploading ? (
        <UploadingState />
      ) : (
        <div className="space-y-2">
          <UploadIcon type={type} />
          <UploadInstructions
            isDragActive={isDragActive}
            type={type}
            currentFileCount={currentFileCount}
            maxFiles={maxFiles}
            helperText={helperText}
          />
        </div>
      )}
    </div>
  );
};
