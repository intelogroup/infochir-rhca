
import React from "react";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";
import { cn } from "@/lib/utils";

interface FileUploadsSectionProps {
  articleFiles: string[];
  setArticleFiles: React.Dispatch<React.SetStateAction<string[]>>;
  imageAnnexes: string[];
  setImageAnnexes: React.Dispatch<React.SetStateAction<string[]>>;
  formErrors: {[key: string]: string};
  hasSubmissionAttempt?: boolean;
}

export const FileUploadsSection: React.FC<FileUploadsSectionProps> = ({
  articleFiles,
  setArticleFiles,
  imageAnnexes,
  setImageAnnexes,
  formErrors,
  hasSubmissionAttempt = false
}) => {
  return (
    <>
      <div className="space-y-4" data-field="articleFiles">
        <h3 className="text-lg font-semibold">Fichiers de l'article *</h3>
        <div className={cn(
          "rounded-lg border-2 border-dashed p-4",
          hasSubmissionAttempt && formErrors.articleFiles && "border-destructive bg-destructive/5"
        )}>
          <MultiFileUploader
            bucket="article_files"
            acceptedFileTypes={{
              'application/pdf': ['.pdf'],
              'application/msword': ['.doc'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
            }}
            maxFileSize={30}
            maxFiles={20} 
            onUploadComplete={setArticleFiles}
            helperText="Formats acceptés: DOC, DOCX, PDF. Taille max: 30MB. Maximum 20 fichiers"
          />
        </div>
        {formErrors.articleFiles && (
          <p className="text-sm text-destructive">{formErrors.articleFiles}</p>
        )}
        {articleFiles.length > 0 && (
          <p className="text-sm text-green-600">{articleFiles.length} fichier(s) uploadé(s)</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Images et annexes</h3>
        <MultiFileUploader
          bucket="article_annexes"
          acceptedFileTypes={{
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
          }}
          maxFileSize={30}
          maxFiles={20}
          onUploadComplete={setImageAnnexes}
          helperText="Formats acceptés: PNG, JPEG, GIF. Taille max: 30MB. Maximum 20 fichiers"
          type="image"
        />
        {imageAnnexes.length > 0 && (
          <p className="text-sm text-green-600">{imageAnnexes.length} image(s) uploadée(s)</p>
        )}
      </div>
    </>
  );
};
