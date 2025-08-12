import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { ArticleFormData, Article } from "@/types/article";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const ArticleEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!id) throw new Error("Article ID is required");
      
      const { data, error } = await supabase
        .from('unified_content')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error("Article not found");
      
      return data as Article;
    },
    enabled: !!id
  });

  const handleSubmit = async (data: ArticleFormData) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('unified_content')
        .update({
          title: data.title,
          abstract: data.abstract,
          source: data.publicationType,
          authors: data.authors,
          category: data.category,
          tags: data.tags,
          institution: data.institution,
          volume: data.volume,
          issue: data.issue,
          page_number: data.pageNumber,
          specialty: data.specialty,
          status: data.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Article mis à jour avec succès!");
      navigate("/admin/articles");
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error("Erreur lors de la mise à jour de l'article");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Modification d'article" 
          description="Modifier les informations de l'article"
          backLink="/admin/articles"
        />
        <div className="flex justify-center py-12">
          <LoadingSpinner variant="default" size="lg" text="Chargement de l'article..." />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Modification d'article" 
          description="Modifier les informations de l'article"
          backLink="/admin/articles"
        />
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">
              {error ? "Erreur lors du chargement de l'article" : "Article non trouvé"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Modification d'article" 
        description={`Modifier "${article.title}"`}
        backLink="/admin/articles"
      />
      
      <div className="max-w-4xl">
        <ArticleForm 
          initialData={article} 
          onSubmit={handleSubmit}
          isEditing
        />
      </div>
    </div>
  );
};

export default ArticleEdit;