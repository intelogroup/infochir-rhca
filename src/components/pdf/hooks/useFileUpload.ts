
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeFilename, generateStandardizedFilename } from "../utils/fileNaming";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('FileUpload');

interface UseFileUploadOptions {
  bucket: string;
  maxFileSize: number;
  maxFiles: number;
  onUploadComplete: (urls: string[]) => void;
  volumeInfo?: {
    volume: string;
    issue: string;
  };
  type?: 'document' | 'image';
}

export const useFileUpload = ({
  bucket,
  maxFileSize,
  maxFiles,
  onUploadComplete,
  volumeInfo,
  type = 'document'
}: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [currentUploadName, setCurrentUploadName] = useState<string>("");
  
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

        // Sanitize and standardize filename
        const sanitizedName = sanitizeFilename(file.name);
        const fileName = generateStandardizedFilename(sanitizedName, volumeInfo, bucket, type);
        
        logger.log(`[FileUpload:INFO] Generated filename: ${fileName} for bucket: ${bucket}`);

        try {
          const { data, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: true // Allow overwriting existing files
            });
  
          if (uploadError) {
            logger.error('Upload error:', uploadError);
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
          logger.error('Unexpected upload error:', error);
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
      logger.error('Upload error:', error);
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
      logger.error('Delete error:', error);
      toast.error("Erreur lors de la suppression du fichier");
    }
  };

  return {
    isUploading,
    uploadedFiles,
    currentUploadName,
    handleFileSelect,
    removeFile
  };
};
