
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileUploadArea } from "./FileUploadArea";
import { FileList } from "./FileList";
import { formatDateForFilename, formatRHCACoverImageFilename } from "@/lib/utils";

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
  maxFileSize = 30,
  maxFiles = 5,
  onUploadComplete,
  helperText,
  type = 'document',
  volumeInfo
}: MultiFileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [currentUploadName, setCurrentUploadName] = useState<string>("");

  const generateRHCAFilename = (originalName: string) => {
    if (!volumeInfo || (bucket !== 'rhca-pdfs' && bucket !== 'rhca_covers')) {
      return originalName;
    }

    const now = new Date();
    const fileExt = originalName.split('.').pop() || (type === 'document' ? 'pdf' : 'png');
    
    if (bucket === 'rhca_covers') {
      // Use the full date format for cover images: RHCA_vol_XX_no_XX_DD_MM_YYYY.png
      const paddedVolume = volumeInfo.volume.padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      return `RHCA_vol_${paddedVolume}_no_${volumeInfo.issue}_${day}_${month}_${year}.${fileExt}`;
    } else {
      // For PDF documents
      const dateFormatted = formatDateForFilename(now);
      const paddedVolume = volumeInfo.volume.padStart(2, '0');
      return `RHCA_vol_${paddedVolume}_no_${volumeInfo.issue}_${dateFormatted}.${fileExt}`;
    }
  };

  const handleFileSelect = async (files: File[]) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      toast.error(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers`);
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];
    const failedUploads: string[] = [];
    const totalFiles = files.length;
    let currentFileIndex = 0;

    try {
      for (const file of files) {
        currentFileIndex++;
        setCurrentUploadName(file.name);

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast.error(`Le fichier ${file.name} ne doit pas dépasser ${maxFileSize}MB`);
          failedUploads.push(file.name);
          continue;
        }

        // Show upload starting
        toast.loading(`Upload de ${file.name} en cours... (${currentFileIndex}/${totalFiles})`, {
          id: `upload-${file.name}`,
          duration: 10000,
        });

        // Sanitize filename and create a unique name based on criteria
        const sanitizedName = file.name.replace(/[^\x00-\x7F]/g, '_');
        
        // Use RHCA naming convention if applicable
        let fileName = sanitizedName;
        if ((bucket === 'rhca-pdfs' || bucket === 'rhca_covers') && volumeInfo) {
          fileName = generateRHCAFilename(sanitizedName);
          console.log(`[MultiFileUploader:INFO] Generated filename: ${fileName}`);
        } else {
          fileName = `${Date.now()}_${sanitizedName}`;
        }

        try {
          const { data, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: true // Allow overwriting existing files
            });
  
          if (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error(`Erreur lors de l'upload de ${file.name}: ${uploadError.message}`, {
              id: `upload-${file.name}`,
              duration: 5000
            });
            failedUploads.push(file.name);
            continue;
          }
  
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);
  
          uploadedUrls.push(publicUrl);
          toast.success(`${file.name} uploadé avec succès (${(file.size / (1024 * 1024)).toFixed(2)} MB)`, {
            id: `upload-${file.name}`,
            duration: 3000
          });
        } catch (error: any) {
          console.error('Unexpected upload error:', error);
          toast.error(`Erreur lors de l'upload de ${file.name}: ${error?.message || 'Erreur inconnue'}`, {
            id: `upload-${file.name}`,
            duration: 5000
          });
          failedUploads.push(file.name);
        }
      }

      if (failedUploads.length > 0) {
        toast.error(`Échec de l'upload pour: ${failedUploads.join(', ')}`, {
          duration: 5000
        });
      }

      if (uploadedUrls.length > 0) {
        const updatedFiles = [...uploadedFiles, ...uploadedUrls];
        setUploadedFiles(updatedFiles);
        onUploadComplete(updatedFiles);
        
        if (uploadedUrls.length === 1) {
          toast.success("Fichier uploadé avec succès", { duration: 3000 });
        } else {
          toast.success(`${uploadedUrls.length} fichiers uploadés avec succès`, { duration: 3000 });
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'upload des fichiers. Veuillez réessayer.", {
        duration: 5000
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});
      setCurrentUploadName("");
    }
  };

  const removeFile = async (urlToRemove: string) => {
    try {
      const fileName = urlToRemove.split('/').pop();
      if (!fileName) return;

      toast.loading("Suppression du fichier...", {
        id: `delete-${fileName}`
      });

      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) {
        toast.error(`Erreur lors de la suppression: ${error.message}`, {
          id: `delete-${fileName}`
        });
        throw error;
      }

      const updatedFiles = uploadedFiles.filter(url => url !== urlToRemove);
      setUploadedFiles(updatedFiles);
      onUploadComplete(updatedFiles);
      toast.success("Fichier supprimé avec succès", {
        id: `delete-${fileName}`
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Erreur lors de la suppression du fichier");
    }
  };

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
