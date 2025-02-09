
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const mapDatabaseArticleToArticle = (dbArticle: any): Article => {
  console.log('Mapping database article:', dbArticle);
  
  const publicationDate = new Date(dbArticle.publication_date);

  const mappedArticle: Article = {
    id: dbArticle.id,
    title: dbArticle.title,
    abstract: dbArticle.abstract || '',
    date: dbArticle.publication_date,
    publicationDate,
    source: dbArticle.source,
    category: dbArticle.category,
    authors: dbArticle.co_authors || [],
    tags: dbArticle.tags || [],
    imageUrl: dbArticle.image_url || undefined,
    views: dbArticle.views || 0,
    citations: dbArticle.citations || 0,
    pdfUrl: dbArticle.pdf_url || undefined,
    downloads: dbArticle.downloads || 0,
    institution: dbArticle.institution,
    status: dbArticle.status,
    userId: dbArticle.user_id,
    shares: dbArticle.shares || 0,
    volume: dbArticle.volume,
    issue: dbArticle.issue,
    pageNumber: dbArticle.page_number,
    specialty: dbArticle.specialty,
    articleType: dbArticle.article_type
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

      const { data, error, count } = await supabase
        .from("articles")
        .select('*', { count: 'exact' })
        .in('source', ['IGM', 'RHCA', 'ADC'])
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
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
