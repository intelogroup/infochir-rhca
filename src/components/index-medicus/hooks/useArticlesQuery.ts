import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article, DatabaseArticle, ArticleSource } from "../types/article";

const mapDatabaseArticleToArticle = (dbArticle: DatabaseArticle): Article => {
  console.log('Mapping database article:', dbArticle);
  
  // Validate source type
  const validSources: ArticleSource[] = ["RHCA", "IGM", "ADC"];
  const source = validSources.includes(dbArticle.source as ArticleSource) 
    ? dbArticle.source as ArticleSource 
    : "RHCA"; // Default to RHCA if invalid source

  // Extract author names from the joined data
  const authorNames = dbArticle.author_names || [];

  const mappedArticle = {
    ...dbArticle,
    date: dbArticle.publication_date,
    source,
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
          author_names:members!articles_authors_fkey(name)
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
      const mappedArticles = data.map((article) => {
        // Transform the joined author data into a simple array of names
        const authorNames = article.author_names?.map((author: any) => author.name) || [];
        return mapDatabaseArticleToArticle({ ...article, author_names: authorNames });
      });

      console.log('Final mapped articles:', mappedArticles);
      return mappedArticles;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
  });
};