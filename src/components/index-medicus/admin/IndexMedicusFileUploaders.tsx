
import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";

interface IndexMedicusFileUploadersProps {
  onPdfUploadComplete: (urls: string[]) => void;
  onCoverUploadComplete: (urls: string[]) => void;
}

export const IndexMedicusFileUploaders: React.FC<IndexMedicusFileUploadersProps> = ({
  onPdfUploadComplete,
  onCoverUploadComplete
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="text-md font-medium mb-2">Cover Images</h3>
        <MultiFileUploader
          bucket="indexmedicus_covers"
          acceptedFileTypes={{
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
          }}
          maxFileSize={5}
          maxFiles={10}
          onUploadComplete={onCoverUploadComplete}
          helperText="Upload cover images for Index Medicus articles (PNG, JPG, WebP)"
          type="image"
        />
      </div>
      <div>
        <h3 className="text-md font-medium mb-2">PDF Documents</h3>
        <MultiFileUploader
          bucket="indexmedicus_pdfs"
          acceptedFileTypes={{
            'application/pdf': ['.pdf']
          }}
          maxFileSize={10}
          maxFiles={5}
          onUploadComplete={onPdfUploadComplete}
          helperText="Upload PDF documents for Index Medicus articles"
          type="document"
        />
      </div>
    </div>
  );
};
