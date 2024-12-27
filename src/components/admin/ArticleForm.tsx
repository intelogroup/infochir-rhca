import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PublicationTypeSelector } from "./article-form/PublicationTypeSelector";
import { ArticleDetails } from "./article-form/ArticleDetails";
import { FileUploaders } from "./article-form/FileUploaders";

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
  const [publicationType, setPublicationType] = useState<"RHCA" | "IGM">("RHCA");

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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <PublicationTypeSelector 
        publicationType={publicationType}
        setPublicationType={setPublicationType}
      />

      <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <ArticleDetails
          title={title}
          setTitle={setTitle}
          abstract={abstract}
          setAbstract={setAbstract}
        />

        <FileUploaders
          setArticleFilesUrls={setArticleFilesUrls}
          setImageAnnexesUrls={setImageAnnexesUrls}
        />
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="min-w-[200px]"
        >
          {isLoading ? "Enregistrement..." : initialData ? "Mettre à jour" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};