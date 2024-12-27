import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";

interface FileUploadersProps {
  setArticleFilesUrls: (urls: string[]) => void;
  setImageAnnexesUrls: (urls: string[]) => void;
}

export const FileUploaders = ({
  setArticleFilesUrls,
  setImageAnnexesUrls
}: FileUploadersProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Fichiers de l'article (Word, PDF)
        </label>
        <MultiFileUploader
          bucket="article_files"
          acceptedFileTypes=".doc,.docx,.pdf"
          maxFileSize={50}
          maxFiles={5}
          onUploadComplete={setArticleFilesUrls}
          helperText="Formats acceptés: .doc, .docx, .pdf (max 50MB par fichier)"
          type="document"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Images et annexes
        </label>
        <MultiFileUploader
          bucket="article_annexes"
          acceptedFileTypes="image/*"
          maxFileSize={50}
          maxFiles={10}
          onUploadComplete={setImageAnnexesUrls}
          helperText="Formats acceptés: PNG, JPEG, GIF (max 50MB par image)"
          type="image"
        />
      </div>
    </div>
  );
};