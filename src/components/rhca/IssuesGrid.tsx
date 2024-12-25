import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IssueCard } from "./IssueCard";
import { Loader2 } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  volume?: string;
  issue_number?: number;
  date: string;
  article_count?: number;
  pdf_url: string | null;
}

export const IssuesGrid = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      console.log("Fetching RHCA articles...");
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('source', 'RHCA')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

      console.log('Fetched articles:', articles);

      if (!articles || articles.length === 0) {
        setIssues([]);
        return;
      }

      const transformedIssues = articles.map(article => ({
        id: article.id,
        title: article.title,
        volume: article.volume,
        issue_number: article.issue_number,
        date: article.date,
        article_count: article.article_count,
        pdf_url: article.pdf_url
      }));

      console.log('Transformed issues:', transformedIssues);
      setIssues(transformedIssues);
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun article disponible pour le moment
        </div>
      ) : (
        issues.map((issue) => (
          <IssueCard key={issue.id} {...issue} />
        ))
      )}
    </div>
  );
};