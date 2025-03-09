
import React from 'react';
import { FileText } from "lucide-react";

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
  return (
    <div 
      className={`${className} flex items-center justify-center bg-emerald-50/50 border border-emerald-100/50 rounded-lg`}
      style={{ width, height }}
      role="img"
      aria-label={alt}
    >
      <div className="flex flex-col items-center text-emerald-600/50">
        <FileText className="h-8 w-8 mb-2" />
        <span className="text-sm font-medium">{fallbackText || "Image non disponible"}</span>
      </div>
    </div>
  );
};
