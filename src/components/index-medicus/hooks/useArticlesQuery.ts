import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article, DatabaseArticle, ArticleSource } from "../types/article";

const mapDatabaseArticleToArticle = (dbArticle: DatabaseArticle): Article => {
  // Validate source type
  const validSources: ArticleSource[] = ["RHCA", "IGM", "ADC"];
  const source = validSources.includes(dbArticle.source as ArticleSource) 
    ? dbArticle.source as ArticleSource 
    : "RHCA"; // Default to RHCA if invalid source

  return {
    ...dbArticle,
    date: dbArticle.publication_date,
    source,
    authors: dbArticle.authors || [], // Ensure authors is always an array
    tags: dbArticle.tags || [],
    imageUrl: dbArticle.image_url || undefined,
    views: dbArticle.views || 0,
    citations: dbArticle.citations || 0,
    pdfUrl: dbArticle.pdf_url || undefined,
    downloads: dbArticle.downloads || 0,
  };
};

export const useArticlesQuery = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("publication_date", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }

      if (!data) {
        return [];
      }

      // Map database response to match Article type
      return data.map((article) => mapDatabaseArticleToArticle(article as DatabaseArticle));
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
  });
};