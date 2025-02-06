
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "../types";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const mapDatabaseArticleToArticle = (dbArticle: any): Article => {
  console.log('Mapping database article:', dbArticle);
  
  // Extract author names from the members relationship
  const authorNames = dbArticle.article_authors?.map((authorRel: any) => {
    console.log('Processing author relation:', authorRel);
    return authorRel.member?.name;
  }).filter(Boolean) || [];
  
  console.log('Extracted author names:', authorNames);

  // Handle PDF URL properly
  const pdfUrl = typeof dbArticle.pdf_url === 'string' ? dbArticle.pdf_url : undefined;

  const mappedArticle = {
    id: dbArticle.id,
    title: dbArticle.title,
    abstract: dbArticle.abstract,
    date: dbArticle.publication_date,
    source: dbArticle.source,
    category: dbArticle.category,
    authors: authorNames.length > 0 ? authorNames : [],
    tags: dbArticle.tags || [],
    imageUrl: dbArticle.image_url || undefined,
    views: dbArticle.views || 0,
    citations: dbArticle.citations || 0,
    pdfUrl: pdfUrl,
    downloads: dbArticle.downloads || 0,
  };

  console.log('Final mapped article:', mappedArticle);
  return mappedArticle;
};

export const useArticlesQuery = (page = 0) => {
  return useQuery({
    queryKey: ["articles", page],
    queryFn: async () => {
      console.log('Starting articles fetch for page:', page);
      
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      console.log('Executing Supabase query with range:', { start, end });

      try {
        // Updated query to properly join with members table through article_authors
        const { data, error, count } = await supabase
          .from("articles")
          .select(`
            *,
            article_authors (
              member:members (
                name
              )
            )
          `, { count: 'exact' })
          .range(start, end)
          .order("publication_date", { ascending: false });

        console.log('Supabase response:', { data, error, count });

        if (error) {
          console.error("Supabase query error:", error);
          toast.error("Erreur lors du chargement des articles");
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
        console.log('Total pages calculated:', totalPages);

        return { articles: mappedArticles, totalPages };
      } catch (err) {
        console.error("Error in useArticlesQuery:", err);
        toast.error("Une erreur est survenue lors du chargement des articles");
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep inactive data for 30 minutes
    retry: 2, // Retry failed requests twice
  });
};
