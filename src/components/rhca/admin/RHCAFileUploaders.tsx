
import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";

interface RHCAFileUploadersProps {
  onPdfUploadComplete: (urls: string[]) => void;
  onCoverUploadComplete: (urls: string[]) => void;
}

export const RHCAFileUploaders: React.FC<RHCAFileUploadersProps> = ({
  onPdfUploadComplete,
  onCoverUploadComplete
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="text-md font-medium mb-2">Cover Images</h3>
        <MultiFileUploader
          bucket="rhca_covers"
          acceptedFileTypes={{
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
          }}
          maxFileSize={5}
          maxFiles={10}
          onUploadComplete={onCoverUploadComplete}
          helperText="Upload cover images for RHCA articles (PNG, JPG, WebP)"
          type="image"
          volumeInfo={{
            volume: '4',
            issue: '49'
          }}
        />
      </div>
      <div>
        <h3 className="text-md font-medium mb-2">PDF Documents</h3>
        <MultiFileUploader
          bucket="rhca-pdfs"
          acceptedFileTypes={{
            'application/pdf': ['.pdf']
          }}
          maxFileSize={10}
          maxFiles={5}
          onUploadComplete={onPdfUploadComplete}
          helperText="Upload PDF documents for RHCA articles"
          type="document"
          volumeInfo={{
            volume: '4',
            issue: '49'
          }}
        />
      </div>
    </div>
  );
};
