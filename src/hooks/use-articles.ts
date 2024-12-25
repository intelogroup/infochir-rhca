import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Issue } from "@/components/issues/types";
import type { ArticleWithRelations } from "@/types/article";

export const useArticles = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [storageFiles, setStorageFiles] = useState<any[]>([]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch articles with related data
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(name),
          article_authors(author:authors(name)),
          article_tags(tag:tags(name))
        `);

      if (articlesError) throw articlesError;

      // Fetch PDF files from storage
      const { data: files, error: storageError } = await supabase
        .storage
        .from('articles')
        .list();

      if (storageError) throw storageError;
      setStorageFiles(files || []);

      // Transform articles to Issue format
      const transformedArticles: Issue[] = (articles as ArticleWithRelations[]).map(article => {
        const pdfFile = files?.find(file => {
          const normalizedFileName = file.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
          return normalizedFileName.includes(normalizedTitle);
        });

        return {
          id: article.id,
          title: article.title,
          date: article.date,
          abstract: article.abstract,
          pdfUrl: pdfFile ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/articles/${pdfFile.name}` : undefined,
          articleCount: article.article_count,
          authors: article.article_authors?.map(a => a.author.name),
          tags: article.article_tags?.map(t => t.tag.name)
        };
      });

      setFilteredIssues(transformedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching articles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    isLoading,
    error,
    filteredIssues,
    setFilteredIssues,
    refreshArticles: fetchArticles
  };
};