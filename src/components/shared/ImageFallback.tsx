
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
}) => (
  <div 
    className={`${className} flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg`}
    style={{ width, height, minHeight: '100px' }}
    role="img"
    aria-label={alt}
  >
    <div className="flex flex-col items-center text-gray-500">
      <FileText className="h-8 w-8 mb-2 text-gray-400" />
      <span className="text-sm font-medium px-2 text-center">{fallbackText || "Image non disponible"}</span>
    </div>
  </div>
);
