import { useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface FileUploadAreaProps {
  acceptedFileTypes: string;
  isUploading: boolean;
  onFileSelect: (files: File[]) => void;
  helperText?: string;
  maxFiles: number;
  currentFileCount: number;
}

export const FileUploadArea = ({
  acceptedFileTypes,
  isUploading,
  onFileSelect,
  helperText,
  maxFiles,
  currentFileCount
}: FileUploadAreaProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileSelect(acceptedFiles);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.split(',').reduce((acc, curr) => ({
      ...acc,
      [curr]: []
    }), {}),
    disabled: isUploading || currentFileCount >= maxFiles,
    maxFiles: maxFiles - currentFileCount
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
        transition-colors duration-200 ${isDragActive ? 'bg-secondary/5 border-secondary' : 'hover:bg-gray-50'} 
        ${isUploading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} capture="environment" />
      {isUploading ? (
        <div className="space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-secondary" />
          <p className="text-sm text-gray-500">Upload en cours...</p>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="h-8 w-8 mx-auto text-gray-400" />
          <p className="text-sm font-medium">
            {isDragActive ? "Déposez les fichiers ici" : "Cliquez ou déposez vos fichiers ici"}
          </p>
          {currentFileCount >= maxFiles && (
            <p className="text-xs text-red-500">
              Nombre maximum de fichiers atteint
            </p>
          )}
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};