
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";
import { AlertCircle, CheckCircle2, FileText, Image } from "lucide-react";

interface FileUploadersProps {
  setArticleFilesUrls: (urls: string[]) => void;
  setImageAnnexesUrls: (urls: string[]) => void;
  errors: { [key: string]: string };
  publicationType: "RHCA" | "IGM" | "ADC" | "INDEX";
}

export const FileUploaders = ({ 
  setArticleFilesUrls, 
  setImageAnnexesUrls, 
  errors, 
  publicationType 
}: FileUploadersProps) => {
  const getBucketForType = (type: string) => {
    switch (type) {
      case "RHCA":
        return "rhca-pdfs";
      case "IGM":
        return "igm-pdfs";
      case "ADC":
        return "article_files";
      case "INDEX":
        return "indexmedicuspdf";
      default:
        return "article_files";
    }
  };

  const articleBucket = getBucketForType(publicationType);

  return (
    <div className="space-y-6">
      {/* Article Files Upload */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">Fichiers d'article</span>
          <span className="text-sm text-muted-foreground">(Requis)</span>
        </div>
        
        <MultiFileUploader
          bucket={articleBucket}
          acceptedFileTypes={{
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
          }}
          maxFileSize={30}
          maxFiles={5}
          onUploadComplete={setArticleFilesUrls}
          helperText="Formats: PDF, DOC, DOCX - Max: 30MB"
        />
        
        {errors.files && (
          <p className="text-sm text-destructive mt-1">{errors.files}</p>
        )}
      </div>

      {/* Image Annexes Upload */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Image className="h-4 w-4" />
          <span className="text-sm font-medium">Annexes et images</span>
          <span className="text-sm text-muted-foreground">(Optionnel)</span>
        </div>
        
        <MultiFileUploader
          bucket="article_annexes"
          acceptedFileTypes={{
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
          }}
          maxFileSize={10}
          maxFiles={10}
          onUploadComplete={setImageAnnexesUrls}
          helperText="Formats: PNG, JPG, JPEG, GIF, WebP - Max: 10MB"
          type="image"
        />
      </div>
    </div>
  );
};
