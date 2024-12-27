import { useCallback, useState } from "react";
import { Upload, Loader2, Image as ImageIcon, FileText } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface FileUploadAreaProps {
  acceptedFileTypes: string;
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
      onFileSelect(files);
      toast.success("Fichier(s) collé(s) avec succès");
    }
  }, [onFileSelect]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (currentFileCount + acceptedFiles.length > maxFiles) {
      toast.error(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers`);
      return;
    }
    onFileSelect(acceptedFiles);
  }, [onFileSelect, maxFiles, currentFileCount]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.split(',').reduce((acc, curr) => ({
      ...acc,
      [curr]: []
    }), {}),
    disabled: isUploading || currentFileCount >= maxFiles,
    maxFiles: maxFiles - currentFileCount,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => {
      setIsDragActive(false);
      toast.error("Type de fichier non accepté");
    }
  });

  // Add paste event listener
  useState(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  });

  const getInputCapture = () => {
    if (!isMobile) return undefined;
    if (type === 'image') return "environment";
    return undefined;
  };

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
      <input {...getInputProps()} capture={getInputCapture()} />
      {isUploading ? (
        <div className="space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-secondary" />
          <p className="text-sm text-gray-500">Upload en cours...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {type === 'image' ? (
            <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
          ) : (
            <FileText className="h-8 w-8 mx-auto text-gray-400" />
          )}
          <p className="text-sm font-medium">
            {isDragActive 
              ? "Déposez les fichiers ici" 
              : isMobile 
                ? "Appuyez pour prendre une photo ou choisir un fichier" 
                : "Cliquez ou déposez vos fichiers ici"}
          </p>
          {currentFileCount >= maxFiles && (
            <p className="text-xs text-red-500">
              Nombre maximum de fichiers atteint
            </p>
          )}
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
          <p className="text-xs text-gray-400">
            {type === 'image' 
              ? "Vous pouvez aussi coller une image depuis le presse-papier" 
              : "Vous pouvez aussi coller un fichier depuis le presse-papier"}
          </p>
        </div>
      )}
    </div>
  );
};