
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const PDFUploader = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error("Seuls les fichiers PDF sont acceptés");
      return;
    }

    // Validate file size (30MB max)
    if (file.size > 30 * 1024 * 1024) {
      toast.error("Le fichier ne doit pas dépasser 30MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('article_submissions')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('article_submissions')
        .getPublicUrl(fileName);

      toast.success("PDF uploadé avec succès");
      console.log('Upload successful:', publicUrl);
      
      // You can emit an event or use a callback to pass the URL back to the parent component
      // For now, we'll just log it
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'upload du PDF");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
        id="pdf-upload"
        name="pdf-upload"
      />
      <label htmlFor="pdf-upload">
        <Button 
          variant="outline" 
          disabled={isUploading}
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
              Upload PDF
            </>
          )}
        </Button>
      </label>
    </div>
  );
};
