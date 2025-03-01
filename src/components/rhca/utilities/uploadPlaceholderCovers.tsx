
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDateToSimple } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Placeholder image URLs (these would be replaced with actual placeholders)
const PLACEHOLDER_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=800&h=600&fit=crop"
];

interface UploadPlaceholderCoversProps {
  volumes?: Array<{
    volume: string,
    issue: string,
    date?: string
  }>;
}

export const UploadPlaceholderCovers = ({ 
  volumes = [
    { volume: "1", issue: "1" },
    { volume: "1", issue: "2" },
    { volume: "2", issue: "1" },
    { volume: "2", issue: "2" }
  ] 
}: UploadPlaceholderCoversProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const uploadPlaceholderCovers = async () => {
    setIsUploading(true);
    setUploadedCount(0);
    const total = volumes.length;
    setTotalCount(total);
    
    try {
      let successCount = 0;

      for (let i = 0; i < volumes.length; i++) {
        const { volume, issue } = volumes[i];
        const imageUrl = PLACEHOLDER_IMAGE_URLS[i % PLACEHOLDER_IMAGE_URLS.length];
        
        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
          toast.error(`Failed to fetch image ${i + 1}`);
          continue;
        }
        
        const imageBlob = await response.blob();
        const now = new Date();
        const dateFormatted = formatDateToSimple(now);
        const fileExt = "jpg"; // Default to jpg

        const fileName = `RHCA_vol_${volume}_no_${issue}_${dateFormatted}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('rhca_covers')
          .upload(fileName, imageBlob, {
            cacheControl: '3600',
            upsert: true, // Override if exists
            contentType: 'image/jpeg'
          });
          
        if (error) {
          console.error('Upload error:', error);
          toast.error(`Error uploading placeholder ${i + 1}: ${error.message}`);
          continue;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('rhca_covers')
          .getPublicUrl(fileName);
          
        console.log(`Uploaded cover: ${publicUrl}`);
        
        successCount++;
        setUploadedCount(prevCount => prevCount + 1);
      }
      
      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} placeholder covers`);
      } else {
        toast.error('Failed to upload any placeholder covers');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred while uploading placeholder covers');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Upload Placeholder Covers</h3>
      <p className="text-sm text-gray-500">
        This will upload placeholder cover images to the rhca_covers bucket using the RHCA_vol_X_no_Y_date.jpg format.
      </p>
      
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading {uploadedCount}/{totalCount} covers...</span>
        </div>
      )}
      
      <Button 
        onClick={uploadPlaceholderCovers} 
        disabled={isUploading}
        className="gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Placeholder Covers'
        )}
      </Button>
    </div>
  );
};
