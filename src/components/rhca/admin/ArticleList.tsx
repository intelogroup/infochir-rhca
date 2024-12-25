import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ArticleFormDialog } from "./ArticleFormDialog";
import { ArticlesTable } from "./ArticlesTable";
import { toast } from "sonner";
import type { Article } from "@/types/article";

export const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("source", "RHCA")
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

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingArticle(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
          <p className="text-sm text-gray-500">Manage RHCA articles</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      <ArticlesTable
        articles={articles}
        onEdit={handleEdit}
        onUpdate={fetchArticles}
        isLoading={isLoading}
      />

      <ArticleFormDialog
        article={editingArticle}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={fetchArticles}
      />
    </div>
  );
};