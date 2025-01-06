import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AtlasModalHeaderProps {
  title: string;
  coverImage?: string;
  onImageLoad?: () => void;
}

export const AtlasModalHeader = ({ title, coverImage, onImageLoad }: AtlasModalHeaderProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onImageLoad?.();
  };

  return (
    <div className="space-y-6">
      <div className="relative h-[200px]">
        {coverImage ? (
          <>
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <img
              src={coverImage}
              alt=""
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
        )}
      </div>
      
      <div className="px-6 space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          {title}
        </h2>
      </div>
    </div>
  );
};