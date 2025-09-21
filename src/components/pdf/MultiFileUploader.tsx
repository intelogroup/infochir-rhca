
import { useState } from "react";
import { FileUploadArea } from "./FileUploadArea";
import { FileList } from "./FileList";
import { useFileUpload } from "./hooks/useFileUpload";

interface MultiFileUploaderProps {
  bucket: string;
  acceptedFileTypes: Record<string, string[]>;
  maxFileSize?: number;
  maxFiles?: number;
  onUploadComplete: (urls: string[]) => void;
  helperText?: string;
  type?: 'document' | 'image';
  volumeInfo?: {
    volume: string;
    issue: string;
  };
}

export const MultiFileUploader = ({
  bucket,
  acceptedFileTypes,
  maxFileSize = 10,
  maxFiles = 5,
  onUploadComplete,
  helperText,
  type = 'document',
  volumeInfo
}: MultiFileUploaderProps) => {
  const {
    isUploading,
    uploadedFiles,
    currentUploadName,
    handleFileSelect,
    removeFile
  } = useFileUpload({
    bucket,
    maxFileSize,
    maxFiles,
    onUploadComplete,
    volumeInfo,
    type
  });

  return (
    <div className="space-y-4">
      <FileUploadArea
        acceptedFileTypes={acceptedFileTypes}
        isUploading={isUploading}
        onFileSelect={handleFileSelect}
        helperText={helperText}
        maxFiles={maxFiles}
        currentFileCount={uploadedFiles.length}
        type={type}
        currentUploadName={currentUploadName}
      />
      <FileList
        files={uploadedFiles}
        onRemove={removeFile}
        isUploading={isUploading}
        type={type}
      />
      {uploadedFiles.length > 0 && uploadedFiles.length < maxFiles && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          {uploadedFiles.length} fichier(s) sur {maxFiles} uploadé(s) ({maxFiles - uploadedFiles.length} restant)
        </p>
      )}
      {uploadedFiles.length >= maxFiles && (
        <p className="text-xs text-amber-500 text-center mt-2">
          Limite de fichiers atteinte ({maxFiles}/{maxFiles})
        </p>
      )}
    </div>
  );
};
