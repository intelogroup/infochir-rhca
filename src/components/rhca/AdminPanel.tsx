
import React from "react";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { Article, ArticleFormData } from "@/types/article";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminPanelProps {
  article?: Article;
  onUpdate?: () => void;
}

export const AdminPanel = ({ article, onUpdate }: AdminPanelProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: ArticleFormData) => {
    if (!article?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('unified_content')
        .update({
          title: data.title,
          abstract: data.abstract,
          source: data.publicationType,
        })
        .eq('id', article.id);

      if (error) throw error;

      toast.success("Article mis à jour avec succès");
      onUpdate?.();
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Erreur lors de la mise à jour de l'article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestion de l'article</h2>
      {article && (
        <ArticleForm
          initialData={article}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
