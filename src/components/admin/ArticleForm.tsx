import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";
import { toast } from "sonner";

interface ArticleFormProps {
  initialData?: {
    title: string;
    abstract: string;
  };
  onSubmit: (data: { 
    title: string; 
    abstract: string;
    articleFilesUrls: string[];
    imageAnnexesUrls: string[];
  }) => Promise<void>;
  isLoading: boolean;
}

export const ArticleForm = ({ initialData, onSubmit, isLoading }: ArticleFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [abstract, setAbstract] = useState(initialData?.abstract || "");
  const [articleFilesUrls, setArticleFilesUrls] = useState<string[]>([]);
  const [imageAnnexesUrls, setImageAnnexesUrls] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (articleFilesUrls.length === 0) {
      toast.error("Veuillez uploader au moins un fichier d'article");
      return;
    }

    await onSubmit({ 
      title, 
      abstract, 
      articleFilesUrls,
      imageAnnexesUrls 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="abstract" className="block text-sm font-medium mb-1">
          Abstract
        </label>
        <Textarea
          id="abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Fichiers de l'article (Word, PDF)
        </label>
        <MultiFileUploader
          bucket="article_files"
          acceptedFileTypes=".doc,.docx,.pdf"
          maxFileSize={20}
          maxFiles={3}
          onUploadComplete={setArticleFilesUrls}
          helperText="Formats acceptés: .doc, .docx, .pdf (max 20MB par fichier)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Images et annexes
        </label>
        <MultiFileUploader
          bucket="article_annexes"
          acceptedFileTypes="image/*"
          maxFileSize={10}
          maxFiles={5}
          onUploadComplete={setImageAnnexesUrls}
          helperText="Formats acceptés: PNG, JPEG, GIF (max 10MB par image)"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : initialData ? "Update" : "Save"}
      </Button>
    </form>
  );
};