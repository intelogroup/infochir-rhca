
import React from 'react';
import { FileText, Image, AlertCircle } from "lucide-react";

interface ImageFallbackProps {
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({
  alt,
  width,
  height,
  className = "",
  fallbackText
}) => {
  // Generate consistent gradient based on the alt text
  const getGradientColors = (text: string) => {
    // Hash the alt text to get a consistent color
    const hash = text.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    
    // Convert to positive number
    const positiveHash = Math.abs(hash);
    
    // Generate colors
    const hue1 = positiveHash % 360;
    const hue2 = (hue1 + 30) % 360;
    
    return {
      from: `hsl(${hue1}, 70%, 90%)`,
      to: `hsl(${hue2}, 70%, 80%)`
    };
  };
  
  const colors = getGradientColors(alt);
  
  return (
    <div 
      className={`${className} flex items-center justify-center rounded-lg overflow-hidden`}
      style={{ 
        width, 
        height,
        background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`
      }}
      role="img"
      aria-label={alt}
    >
      <div className="flex flex-col items-center text-gray-600/90">
        <div className="p-2 bg-white/30 rounded-full mb-2">
          {alt.toLowerCase().includes('pdf') ? (
            <FileText className="h-8 w-8" />
          ) : (
            <Image className="h-8 w-8" />
          )}
        </div>
        <span className="text-sm font-medium px-2 py-1 bg-white/50 rounded text-center max-w-[90%]">
          {fallbackText || "Image non disponible"}
        </span>
      </div>
    </div>
  );
};
