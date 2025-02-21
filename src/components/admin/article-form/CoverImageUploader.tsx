
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";

interface CoverImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
}

export const CoverImageUploader = ({ 
  onImageUpload, 
  currentImage,
  className 
}: CoverImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleImageUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2MB");
      return;
    }

    setIsUploading(true);
    try {
      // Sanitize filename and create a unique name
      const sanitizedName = file.name.replace(/[^\x00-\x7F]/g, '_');
      const fileName = `${Date.now()}_${sanitizedName}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('article_covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('article_covers')
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onImageUpload(publicUrl);
      toast.success("Image de couverture téléchargée avec succès");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading,
    onDrop: async ([file]) => {
      if (file) {
        await handleImageUpload(file);
      }
    }
  });

  const removeImage = () => {
    setPreview(null);
    onImageUpload('');
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Image de couverture</h3>
          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeImage}
              className="text-destructive hover:text-destructive/90"
            >
              <X className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
        </div>
        
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}
            ${isUploading ? 'bg-gray-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-gray-500">Téléchargement en cours...</p>
            </div>
          ) : preview ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
              <ImageOptimizer
                src={preview}
                alt="Cover preview"
                className="w-full h-full object-cover"
                width={400}
                height={225}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Glissez-déposez une image ici, ou cliquez pour sélectionner
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG (max. 2MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
