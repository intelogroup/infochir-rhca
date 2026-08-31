
import React from "react";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

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
        <div className="flex items-start gap-2">
          <h3 className="text-lg font-semibold">Fichiers de l'article *</h3>
          <Info className="h-4 w-4 text-blue-500 mt-1" />
        </div>
        
        <div className="bg-muted border border-border rounded-lg p-3 text-sm text-foreground/80">
          <p className="font-medium mb-1">📎 Système d'attachements par email</p>
          <p>Les fichiers uploadés seront automatiquement envoyés en pièces jointes dans l'email de notification aux administrateurs.</p>
        </div>
        
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
            maxFileSize={10}
            maxFiles={20} 
            onUploadComplete={setArticleFiles}
            helperText="Formats acceptés: DOC, DOCX, PDF. Taille max: 10MB par fichier. Maximum 20 fichiers"
          />
        </div>
        {formErrors.articleFiles && (
          <p className="text-sm text-destructive">{formErrors.articleFiles}</p>
        )}
        {articleFiles.length > 0 && (
          <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-2">
            ✅ {articleFiles.length} fichier(s) uploadé(s) - Seront envoyés en pièces jointes
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <h3 className="text-lg font-semibold">Images et annexes</h3>
          <Info className="h-4 w-4 text-blue-500 mt-1" />
        </div>
        
        <div className="bg-muted border border-border rounded-lg p-3 text-sm text-foreground/80">
          <p>Les images et annexes seront également incluses comme pièces jointes dans l'email de notification.</p>
        </div>
        
        <MultiFileUploader
          bucket="article_annexes"
          acceptedFileTypes={{
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff']
          }}
          maxFileSize={30}
          maxFiles={20}
          onUploadComplete={setImageAnnexes}
          helperText="Formats acceptés: PNG, JPEG, GIF, WebP, BMP, TIFF. Taille max: 30MB par fichier. Maximum 20 fichiers"
          type="image"
        />
        {imageAnnexes.length > 0 && (
          <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-2">
            ✅ {imageAnnexes.length} image(s) uploadée(s) - Seront envoyées en pièces jointes
          </div>
        )}
      </div>
      
      {(articleFiles.length > 0 || imageAnnexes.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-800 mb-2">📧 Informations sur l'envoi</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Limite totale: 45MB par email</li>
            <li>• Les fichiers trop volumineux seront automatiquement exclus</li>
            <li>• Un résumé des pièces jointes sera inclus dans la réponse</li>
            <li>• Les fichiers sont sécurisés et envoyés uniquement aux administrateurs</li>
          </ul>
        </div>
      )}
    </>
  );
};
