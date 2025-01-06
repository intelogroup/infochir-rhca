import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "../types";

const mapDatabaseArticleToArticle = (dbArticle: any): Article => {
  console.log('Mapping database article:', dbArticle);
  
  // Extract author names from the joined data
  const authorNames = dbArticle.article_authors?.map((author: any) => author.member.name) || [];

  const mappedArticle = {
    id: dbArticle.id,
    title: dbArticle.title,
    abstract: dbArticle.abstract,
    date: dbArticle.publication_date,
    source: dbArticle.source,
    category: dbArticle.category,
    authors: authorNames,
    tags: dbArticle.tags || [],
    imageUrl: dbArticle.image_url || undefined,
    views: dbArticle.views || 0,
    citations: dbArticle.citations || 0,
    pdfUrl: dbArticle.pdf_url || undefined,
    downloads: dbArticle.downloads || 0,
  };

  console.log('Mapped article:', mappedArticle);
  return mappedArticle;
};

export const useArticlesQuery = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      console.log('Fetching articles...');
      
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          article_authors (
            member:members (
              name
            )
          )
        `)
        .order("publication_date", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }

      if (!data) {
        console.log('No data returned from query');
        return [];
      }

      console.log('Raw data from Supabase:', data);

      // Map database response to match Article type
      const mappedArticles = data.map((article) => mapDatabaseArticleToArticle(article));

      console.log('Final mapped articles:', mappedArticles);
      return mappedArticles;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
  });
};