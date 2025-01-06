import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
    <div className="relative">
      <div className="relative h-[200px] overflow-hidden">
        {coverImage ? (
          <>
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              src={coverImage}
              alt=""
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent"
      >
        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>
      </motion.div>
    </div>
  );
};