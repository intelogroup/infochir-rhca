
import * as React from "react";

interface ImageFallbackProps {
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackText?: string;
}

export const ImageFallback = ({
  alt,
  width,
  height,
  className = "",
  fallbackText = "Image indisponible"
}: ImageFallbackProps) => {
  // Generate dimensions style
  const style: React.CSSProperties = {};
  if (width) style.width = `${width}px`;
  if (height) style.height = `${height}px`;

  return (
    <div 
      className={`${className} bg-gray-100 flex items-center justify-center text-center rounded`} 
      style={style}
      aria-label={`${alt} - ${fallbackText}`}
    >
      <div className="px-2">
        <span className="text-gray-400 text-xs">{fallbackText}</span>
      </div>
    </div>
  );
};

export default ImageFallback;
