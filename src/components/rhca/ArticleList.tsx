import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IssueCard } from "./IssueCard";
import { Loader2 } from "lucide-react";

interface Article {
  id: string;
  title: string;
  volume?: string;
  issue_number?: number;
  date: string;
  article_count?: number;
  pdf_url?: string;
}

export const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('source', 'RHCA')
        .order('date', { ascending: false });

      if (error) throw error;

      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun article disponible pour le moment
        </div>
      ) : (
        articles.map((article) => (
          <IssueCard key={article.id} {...article} />
        ))
      )}
    </div>
  );
};