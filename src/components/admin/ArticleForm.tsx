import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
      <div className="flex justify-center gap-8 mb-8">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPublicationType("RHCA")}
          className={`relative p-4 rounded-lg border-2 transition-colors ${
            publicationType === "RHCA" 
              ? "border-primary bg-primary/5" 
              : "border-gray-200 hover:border-primary/50"
          }`}
        >
          <img 
            src="/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
            alt="RHCA Logo"
            className="h-20 w-20 object-contain"
          />
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPublicationType("IGM")}
          className={`relative p-4 rounded-lg border-2 transition-colors ${
            publicationType === "IGM" 
              ? "border-primary bg-primary/5" 
              : "border-gray-200 hover:border-primary/50"
          }`}
        >
          <img 
            src="/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
            alt="IGM Logo"
            className="h-20 w-20 object-contain"
          />
        </motion.button>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700">
            Titre
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            placeholder="Entrez le titre de votre article"
            required
          />
        </div>

        <div>
          <label htmlFor="abstract" className="block text-sm font-medium mb-1 text-gray-700">
            Résumé
          </label>
          <Textarea
            id="abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className="w-full min-h-[150px]"
            placeholder="Entrez le résumé de votre article"
            required
          />
        </div>

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