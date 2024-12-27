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
        if (file) {
          // Check if the file type matches the accepted types
          const isAcceptedType = type === 'image' 
            ? file.type.startsWith('image/')
            : acceptedFileTypes.split(',').some(type => 
                file.name.toLowerCase().endsWith(type.replace('.', '').toLowerCase())
              );

          if (isAcceptedType) {
            files.push(file);
          } else {
            toast.error(`Le type de fichier ${file.type} n'est pas accepté`);
          }
        }
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
  }, [onFileSelect, maxFiles, currentFileCount, type, acceptedFileTypes]);

  const getInputCapture = (): "environment" | "user" | undefined => {
    if (!isMobile) return undefined;
    if (type === 'image') return "environment";
    return undefined;
  };

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
    onDropAccepted: () => {
      setIsDragActive(false);
      toast.success("Fichiers acceptés");
    },
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
                ? type === 'image'
                  ? "Appuyez pour prendre une photo ou choisir une image"
                  : "Appuyez pour choisir un fichier"
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