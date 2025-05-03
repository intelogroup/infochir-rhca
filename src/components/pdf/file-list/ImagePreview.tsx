
import React from 'react';

interface ImagePreviewProps {
  url: string | null;
}

export const ImagePreview = ({ url }: ImagePreviewProps) => {
  if (!url) return null;
  
  return (
    <div className="mt-4">
      <img 
        src={url} 
        alt="Preview" 
        className="max-h-64 rounded-md mx-auto border shadow-sm"
      />
    </div>
  );
};
