
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface IssueCardCoverProps {
  coverImage?: string;
  title: string;
}

export const IssueCardCover = ({ coverImage, title }: IssueCardCoverProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <AspectRatio ratio={3/4} className="overflow-hidden rounded-lg bg-muted/10">
      {coverImage && !imageError ? (
        <div className="relative w-full h-full">
          <div 
            className={cn(
              "absolute inset-0 bg-muted/20 backdrop-blur-[2px] transition-opacity duration-300",
              imageLoaded ? "opacity-0" : "opacity-100"
            )}
          />
          <img 
            src={coverImage} 
            alt={`Couverture ${title}`}
            className={cn(
              "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.error(`Failed to load image: ${coverImage}`);
              setImageError(true);
            }}
          />
        </div>
      ) : (
        <div className="w-full h-full bg-secondary/5 flex items-center justify-center flex-col">
          {imageError ? (
            <>
              <AlertCircle className="h-8 w-8 text-secondary/30 mb-2" />
              <span className="text-secondary/30 text-sm font-medium">Image non disponible</span>
            </>
          ) : (
            <span className="text-secondary/20 text-xl font-bold">PDF</span>
          )}
        </div>
      )}
    </AspectRatio>
  );
};
