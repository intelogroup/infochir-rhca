import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IssueCard } from "./IssueCard";

interface Issue {
  id: string;
  title: string;
  volume?: string;
  issue_number?: number;
  date: string;
  article_count?: number;
  pdf_url?: string;
}

export const IssuesGrid = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('source', 'RHCA')
        .order('date', { ascending: false });

      if (error) throw error;

      // Filter for reanimation articles (assuming they have "Réanimation" in the title)
      const reanimationArticles = articles.filter(article => 
        article.title.toLowerCase().includes('réanimation') ||
        article.title.toLowerCase().includes('reanimation')
      );

      setIssues(reanimationArticles.map(article => ({
        id: article.id,
        title: article.title,
        volume: article.volume,
        issue_number: article.issue_number,
        date: article.date,
        articleCount: article.article_count,
        pdf_url: article.pdf_url
      })));
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun article de réanimation disponible pour le moment
        </div>
      ) : (
        issues.map((issue) => (
          <IssueCard key={issue.id} {...issue} />
        ))
      )}
    </div>
  );
};