import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ArticleList } from "../shared/ArticleList";
import { ArticleFormDialog } from "../shared/ArticleFormDialog";
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
      if (editingArticle) {
        const { error } = await supabase
          .from("articles")
          .update(formData)
          .eq("id", editingArticle.id);

        if (error) throw error;
        toast.success("Article updated successfully");
      } else {
        const { error } = await supabase
          .from("articles")
          .insert(formData);

        if (error) throw error;
        toast.success("Article added successfully");
      }

      setIsDialogOpen(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Error saving article");
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
          <p className="text-sm text-gray-500">Manage your articles here</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

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