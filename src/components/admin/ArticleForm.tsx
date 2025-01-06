import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PublicationTypeSelector } from "./article-form/PublicationTypeSelector";
import { ArticleDetails } from "./article-form/ArticleDetails";
import { FileUploaders } from "./article-form/FileUploaders";
import { DraftPreview } from "./article-form/DraftPreview";
import { FormErrors } from "./article-form/FormErrors";
import { SubmitButton } from "./article-form/SubmitButton";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = "Le titre est requis";
    }
    
    if (!abstract.trim()) {
      newErrors.abstract = "Le résumé est requis";
    }
    
    if (articleFilesUrls.length === 0) {
      newErrors.files = "Au moins un fichier d'article est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs avant de soumettre");
      return;
    }

    try {
      await onSubmit({ 
        title, 
        abstract, 
        articleFilesUrls,
        imageAnnexesUrls 
      });
      toast.success("Article soumis avec succès");
    } catch (error) {
      toast.error("Erreur lors de la soumission");
      console.error(error);
    }
  };

  const handleSaveDraft = () => {
    const draft = {
      title,
      abstract,
      publicationType,
      articleFilesUrls,
      imageAnnexesUrls,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('article-draft', JSON.stringify(draft));
    toast.success("Brouillon sauvegardé");
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PublicationTypeSelector 
        publicationType={publicationType}
        setPublicationType={setPublicationType}
      />

      <motion.div 
        className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ArticleDetails
          title={title}
          setTitle={setTitle}
          abstract={abstract}
          setAbstract={setAbstract}
          errors={errors}
        />

        <FileUploaders
          setArticleFilesUrls={setArticleFilesUrls}
          setImageAnnexesUrls={setImageAnnexesUrls}
          errors={errors}
        />

        <DraftPreview
          title={title}
          abstract={abstract}
          onSaveDraft={handleSaveDraft}
        />
      </motion.div>

      <FormErrors errors={errors} />

      <div className="flex justify-end">
        <SubmitButton 
          isLoading={isLoading}
          isEditing={!!initialData}
        />
      </div>
    </motion.form>
  );
};