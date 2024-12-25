import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArticleList } from "../shared/ArticleList";
import { ArticleFormDialog } from "../shared/ArticleFormDialog";
import { ArticleActions } from "./articles/ArticleActions";
import { toast } from "sonner";
import type { Article } from "@/types/article";

export const AdminPanel = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Error loading articles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (formData: Partial<Article>) => {
    setIsSubmitting(true);
    try {
      if (!formData.title || !formData.abstract || !formData.source) {
        throw new Error("Missing required fields");
      }

      const articleData: Omit<Article, 'id'> = {
        title: formData.title,
        abstract: formData.abstract,
        source: formData.source,
        date: formData.date || new Date().toISOString(),
        volume: formData.volume,
        issue_number: formData.issue_number,
        article_count: formData.article_count,
        pdf_url: formData.pdf_url || null,
        image_url: formData.image_url || null,
        views: formData.views || 0,
        citations: formData.citations || 0,
        category_id: formData.category_id,
      };

      if (editingArticle) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", editingArticle.id);

        if (error) throw error;
        toast.success("Article updated successfully");
      } else {
        const { error } = await supabase
          .from("articles")
          .insert(articleData);

        if (error) throw error;
        toast.success("Article added successfully");
      }

      setIsDialogOpen(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error(error instanceof Error ? error.message : "Error saving article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this article?");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Article deleted successfully");
      fetchArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Error deleting article");
    }
  };

  return (
    <div className="space-y-8">
      <ArticleActions onAddClick={() => setIsDialogOpen(true)} />

      <ArticleList
        articles={articles}
        onEdit={(article) => {
          setEditingArticle(article);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
        isLoading={isLoading}
        showSource={true}
      />

      <ArticleFormDialog
        article={editingArticle}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingArticle(null);
        }}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};