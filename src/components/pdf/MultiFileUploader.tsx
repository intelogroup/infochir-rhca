import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface MultiFileUploaderProps {
  bucket: string;
  acceptedFileTypes: string;
  maxFileSize?: number;
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (uploadedFiles.length + files.length > maxFiles) {
      toast.error(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const uploadedUrls: string[] = [];
    const failedUploads: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress((i / files.length) * 100);

        // Validate file type
        const fileType = file.type || '';
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        const isAcceptedType = acceptedFileTypes.includes(fileType) || 
                              acceptedFileTypes.includes(`.${fileExtension}`) ||
                              (acceptedFileTypes === "image/*" && file.type.startsWith("image/"));

        if (!isAcceptedType) {
          toast.error(`Le type de fichier ${fileExtension} n'est pas accepté`);
          failedUploads.push(file.name);
          continue;
        }

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast.error(`Le fichier ${file.name} ne doit pas dépasser ${maxFileSize}MB`);
          continue;
        }

        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        // Upload file with progress tracking
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          toast.error(`Erreur lors de l'upload de ${file.name}`);
          failedUploads.push(file.name);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
        toast.success(`${file.name} uploadé avec succès`);
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
      setUploadProgress(0);
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
          capture="environment"
        />
        <label 
          htmlFor={`file-upload-${bucket}`}
          className="w-full"
        >
          <div 
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
              transition-colors duration-200 ${isUploading ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
          >
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-secondary" />
                <div className="w-full">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-500 mt-2">Upload en cours...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-sm font-medium">
                  Cliquez ou déposez vos fichiers ici
                </p>
                {uploadedFiles.length >= maxFiles && (
                  <p className="text-xs text-red-500">
                    Nombre maximum de fichiers atteint
                  </p>
                )}
              </div>
            )}
          </div>
        </label>
      </div>

      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}

      {uploadedFiles.length > 0 && (
        <ul className="space-y-2">
          {uploadedFiles.map((url, index) => (
            <li 
              key={url} 
              className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-secondary" />
                <span className="text-sm truncate max-w-[200px]">
                  Fichier {index + 1}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(url)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                disabled={isUploading}
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