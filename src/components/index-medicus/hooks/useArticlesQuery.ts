
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "../types";

const PAGE_SIZE = 10;

const mapDatabaseArticleToArticle = (dbArticle: any): Article => {
  console.log('Mapping database article:', dbArticle);
  
  // Add more detailed logging for authors relationship
  console.log('Article authors relationship:', dbArticle.article_authors);
  console.log('Raw article data:', {
    authors: dbArticle.authors,
    article_authors: dbArticle.article_authors,
  });
  
  // Extract author names from the article_authors relationship
  const authorNames = dbArticle.article_authors?.map((author: any) => {
    console.log('Processing author:', author);
    return author.member?.name;
  }).filter(Boolean) || [];
  
  console.log('Final extracted author names:', authorNames);

  // Handle PDF URL properly - ensure it's either a string or undefined
  const pdfUrl = typeof dbArticle.pdf_url === 'string' ? dbArticle.pdf_url : undefined;

  const mappedArticle = {
    id: dbArticle.id,
    title: dbArticle.title,
    abstract: dbArticle.abstract,
    date: dbArticle.publication_date,
    source: dbArticle.source,
    category: dbArticle.category,
    authors: authorNames.length > 0 ? authorNames : dbArticle.authors || [],
    tags: dbArticle.tags || [],
    imageUrl: dbArticle.image_url || undefined,
    views: dbArticle.views || 0,
    citations: dbArticle.citations || 0,
    pdfUrl: pdfUrl,
    downloads: dbArticle.downloads || 0,
  };

  console.log('Mapped article:', mappedArticle);
  return mappedArticle;
};

export const useArticlesQuery = (page = 0) => {
  return useQuery({
    queryKey: ["articles", page],
    queryFn: async () => {
      console.log('Fetching articles for page:', page);
      
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      // Update the query to properly fetch the article_authors relationship
      const { data, error, count } = await supabase
        .from("articles")
        .select(`
          *,
          article_authors (
            member (
              name
            )
          )
        `, { count: 'exact' })
        .range(start, end)
        .order("publication_date", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }

      if (!data) {
        console.log('No data returned from query');
        return { articles: [], totalPages: 0 };
      }

      console.log('Raw data from Supabase:', data);
      const mappedArticles = data.map((article) => mapDatabaseArticleToArticle(article));
      const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

      console.log('Final mapped articles:', mappedArticles);
      return { articles: mappedArticles, totalPages };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep inactive data for 30 minutes
  });
};
