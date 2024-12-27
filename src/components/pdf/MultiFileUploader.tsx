import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MultiFileUploaderProps {
  bucket: string;
  acceptedFileTypes: string;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  onUploadComplete: (urls: string[]) => void;
  helperText?: string;
}

export const MultiFileUploader = ({
  bucket,
  acceptedFileTypes,
  maxFileSize = 10,
  maxFiles = 5,
  onUploadComplete,
  helperText
}: MultiFileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (uploadedFiles.length + files.length > maxFiles) {
      toast.error(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers`);
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];
    const failedUploads: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        const fileType = file.type || '';
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        const isAcceptedType = acceptedFileTypes.includes(fileType) || 
                              acceptedFileTypes.includes(`.${fileExtension}`) ||
                              (acceptedFileTypes === "image/*" && file.type.startsWith("image/"));

        if (!isAcceptedType) {
          failedUploads.push(file.name);
          continue;
        }

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast.error(`Le fichier ${file.name} ne doit pas dépasser ${maxFileSize}MB`);
          continue;
        }

        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          failedUploads.push(file.name);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      if (failedUploads.length > 0) {
        toast.error(`Échec de l'upload pour: ${failedUploads.join(', ')}`);
      }

      if (uploadedUrls.length > 0) {
        setUploadedFiles(prev => [...prev, ...uploadedUrls]);
        onUploadComplete([...uploadedFiles, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} fichier(s) uploadé(s) avec succès`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'upload des fichiers");
    } finally {
      setIsUploading(false);
      // Reset the input value to allow uploading the same file again
      const input = document.getElementById(`file-upload-${bucket}`) as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  const removeFile = async (urlToRemove: string) => {
    try {
      // Extract the file name from the URL
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
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileUpload}
          className="hidden"
          id={`file-upload-${bucket}`}
          multiple
        />
        <label htmlFor={`file-upload-${bucket}`}>
          <Button 
            variant="outline" 
            disabled={isUploading || uploadedFiles.length >= maxFiles}
            className="cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload {uploadedFiles.length >= maxFiles ? "(Max atteint)" : ""}
              </>
            )}
          </Button>
        </label>
      </div>

      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}

      {uploadedFiles.length > 0 && (
        <ul className="space-y-2">
          {uploadedFiles.map((url, index) => (
            <li key={url} className="flex items-center justify-between p-2 bg-muted rounded-md">
              <span className="text-sm truncate max-w-[200px]">
                Fichier {index + 1}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(url)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};