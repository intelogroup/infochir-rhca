
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { ArticleFormData } from "@/types/article";
import { toast } from "sonner";

const ArticleCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: ArticleFormData) => {
    try {
      // The ArticleForm component handles the submission directly to Supabase
      // This success callback will be called after successful creation
      toast.success("Article créé avec succès!");
      navigate("/admin/content");
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error("Erreur lors de la création de l'article");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Créer un nouvel article" 
        description="Ajouter un article à la base de données"
        backLink="/admin/content"
      />
      
      <div className="max-w-4xl">
        <ArticleForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ArticleCreate;
