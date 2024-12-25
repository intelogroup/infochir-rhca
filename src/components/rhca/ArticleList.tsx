import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IssueCard } from "./IssueCard";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Article } from "@/types/article";

export const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

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

    fetchArticles();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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