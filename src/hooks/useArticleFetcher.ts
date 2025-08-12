import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/article";

export const useArticleFetcher = (articleId: string | undefined) => {
  return useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      if (!articleId) throw new Error("Article ID is required");
      
      const { data, error } = await supabase
        .from('unified_content')
        .select('*')
        .eq('id', articleId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error("Article not found");
      
      // Map unified_content fields to Article interface
      const article: Article = {
        id: data.id,
        title: data.title,
        abstract: data.abstract,
        publication_type: data.source as "RHCA" | "IGM" | "ADC" | "INDEX",
        source: data.source,
        authors: data.authors || [],
        category: data.category,
        tags: data.tags || [],
        status: data.status,
        institution: data.institution,
        volume: data.volume,
        issue: data.issue,
        page_number: data.page_number,
        specialty: data.specialty,
        pdf_url: data.pdf_url,
        pdf_filename: data.pdf_filename,
        image_url: data.image_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        publication_date: data.publication_date,
        views: data.views,
        downloads: data.downloads,
        shares: data.shares,
        citations: data.citations
      };
      
      return article;
    },
    enabled: !!articleId
  });
};