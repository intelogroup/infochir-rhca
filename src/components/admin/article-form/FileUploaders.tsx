
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface FileUploadersProps {
  setArticleFilesUrls: Dispatch<SetStateAction<string[]>>;
  setImageAnnexesUrls: Dispatch<SetStateAction<string[]>>;
  errors?: { [key: string]: string };
}

export const FileUploaders = ({
  setArticleFilesUrls,
  setImageAnnexesUrls,
  errors
}: FileUploadersProps) => {
  const [articleFiles, setArticleFiles] = useState<string[]>([]);
  const [imageAnnexes, setImageAnnexes] = useState<string[]>([]);
  
  // Pass uploads to parent and maintain local state
  const handleArticleFilesUpload = (urls: string[]) => {
    setArticleFiles(urls);
    setArticleFilesUrls(urls);
  };
  
  const handleImageAnnexesUpload = (urls: string[]) => {
    setImageAnnexes(urls);
    setImageAnnexesUrls(urls);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          Fichiers de l'article
          {articleFiles.length > 0 && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
          {errors?.files && (
            <AlertCircle className="h-5 w-5 text-destructive animate-pulse" />
          )}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (Requis - au moins 1 fichier)
          </span>
        </h3>
        <MultiFileUploader
          bucket="article_files"
          acceptedFileTypes={{
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
          }}
          maxFileSize={30}
          maxFiles={3}
          onUploadComplete={handleArticleFilesUpload}
          helperText="Formats acceptés: DOC, DOCX, PDF. Taille max: 30MB"
        />
        {errors?.files && (
          <p className="mt-1 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.files}
          </p>
        )}
        {articleFiles.length > 0 && !errors?.files && (
          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            {articleFiles.length} fichier(s) uploadé(s) avec succès
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          Images et annexes
          {imageAnnexes.length > 0 && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (Optionnel)
          </span>
        </h3>
        <MultiFileUploader
          bucket="article_annexes"
          acceptedFileTypes={{
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
          }}
          maxFileSize={30}
          maxFiles={5}
          onUploadComplete={handleImageAnnexesUpload}
          helperText="Formats acceptés: PNG, JPEG, GIF. Taille max: 30MB"
          type="image"
        />
        {imageAnnexes.length > 0 && (
          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            {imageAnnexes.length} image(s) uploadée(s) avec succès
          </p>
        )}
      </div>
    </div>
  );
};
