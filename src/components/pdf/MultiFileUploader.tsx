
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
  maxFileSize = 10,
  maxFiles = 5,
  onUploadComplete,
  helperText,
  type = 'document',
  volumeInfo
}: MultiFileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

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

    try {
      for (const file of files) {
        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast.error(`Le fichier ${file.name} ne doit pas dépasser ${maxFileSize}MB`);
          continue;
        }

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
        
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true // Allow overwriting existing files
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Erreur lors de l'upload de ${file.name}`);
          failedUploads.push(file.name);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
        toast.success(`${file.name} uploadé avec succès comme ${fileName}`);
        
        // If this is a cover image, update the corresponding article record
        if (bucket === 'rhca_covers' && volumeInfo) {
          try {
            // Find articles matching this volume/issue
            const { data: articles, error: fetchError } = await supabase
              .from('articles')
              .select('id')
              .eq('volume', volumeInfo.volume)
              .eq('issue', volumeInfo.issue)
              .eq('source', 'RHCA');
              
            if (fetchError) {
              console.error('[MultiFileUploader:ERROR] Failed to fetch articles:', fetchError);
            } else if (articles && articles.length > 0) {
              console.log(`[MultiFileUploader:INFO] Updating ${articles.length} articles with cover_image_filename: ${fileName}`);
              
              // Update all articles with this volume/issue
              const { error: updateError } = await supabase
                .from('articles')
                .update({ cover_image_filename: fileName })
                .in('id', articles.map(a => a.id));
                
              if (updateError) {
                console.error('[MultiFileUploader:ERROR] Failed to update articles:', updateError);
              } else {
                console.log(`[MultiFileUploader:SUCCESS] Updated articles with cover_image_filename`);
              }
            }
          } catch (error) {
            console.error('[MultiFileUploader:ERROR] Error updating articles:', error);
          }
        }
      }

      if (failedUploads.length > 0) {
        toast.error(`Échec de l'upload pour: ${failedUploads.join(', ')}`);
      }

      if (uploadedUrls.length > 0) {
        setUploadedFiles(prev => [...prev, ...uploadedUrls]);
        onUploadComplete([...uploadedFiles, ...uploadedUrls]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'upload des fichiers");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = async (urlToRemove: string) => {
    try {
      const fileName = urlToRemove.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) throw error;

      setUploadedFiles(prev => prev.filter(url => url !== urlToRemove));
      onUploadComplete(uploadedFiles.filter(url => url !== urlToRemove));
      toast.success("Fichier supprimé avec succès");
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
      />
      <FileList
        files={uploadedFiles}
        onRemove={removeFile}
        isUploading={isUploading}
        type={type}
      />
    </div>
  );
};
