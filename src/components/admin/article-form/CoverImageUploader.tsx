
import { useState } from "react";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";
import { AlertCircle, CheckCircle2, Image } from "lucide-react";

interface CoverImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
}

export const CoverImageUploader = ({ onImageUpload, currentImage, className }: CoverImageUploaderProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>(currentImage ? [currentImage] : []);

  const handleImageUpload = (urls: string[]) => {
    setUploadedImages(urls);
    if (urls.length > 0) {
      onImageUpload(urls[0]); // Use the first uploaded image
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Image className="h-4 w-4" />
        <span className="text-sm font-medium">Image de couverture</span>
        {uploadedImages.length > 0 && (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
        <span className="text-sm text-muted-foreground">(Requis)</span>
      </div>
      
      <MultiFileUploader
        bucket="rhca_covers"
        acceptedFileTypes={{
          'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        }}
        maxFileSize={5}
        maxFiles={1}
        onUploadComplete={handleImageUpload}
        helperText="Format: PNG, JPG, JPEG, GIF, WebP - Max: 5MB"
        type="image"
      />
      
      {currentImage && !uploadedImages.length && (
        <div className="mt-2 p-2 border rounded bg-gray-50">
          <p className="text-sm text-gray-600">Image actuelle: {currentImage}</p>
        </div>
      )}
    </div>
  );
};
