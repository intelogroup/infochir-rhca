import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ArticleFormDialog } from "./ArticleFormDialog";
import { ArticlesTable } from "./ArticlesTable";
import { toast } from "sonner";
import type { Article } from "@/types/article";

export const AdminArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setArticles(data as Article[]);
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
          <p className="text-sm text-gray-500">Manage all articles</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      <ArticlesTable
        articles={articles}
        onEdit={(article) => {
          setEditingArticle(article);
          setIsDialogOpen(true);
        }}
        onUpdate={fetchArticles}
        isLoading={isLoading}
      />

      <ArticleFormDialog
        article={editingArticle}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingArticle(null);
        }}
        onSuccess={fetchArticles}
      />
    </div>
  );
};