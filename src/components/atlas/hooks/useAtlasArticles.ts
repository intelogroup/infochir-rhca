
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtlasChapter } from "../types";
import { toast } from "sonner";

export const useAtlasArticles = () => {
  return useQuery({
    queryKey: ["atlas-articles"],
    queryFn: async () => {
      console.log('Fetching Atlas articles...');
      
      try {
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
          .eq('source', 'ADC')
          .order('publication_date', { ascending: false });

        if (error) {
          console.error("Error fetching Atlas articles:", error);
          toast.error("Erreur lors du chargement des articles");
          throw error;
        }

        if (!data) {
          console.log('No Atlas articles found');
          return [];
        }

        console.log('Raw Atlas articles from Supabase:', data);

        // Map database articles to AtlasChapter format
        const atlasChapters: AtlasChapter[] = data.map((article) => ({
          id: article.id,
          title: article.title,
          description: article.abstract,
          lastUpdate: new Date(article.publication_date).toLocaleDateString('fr-FR'),
          author: article.article_authors?.map((a: any) => a.member.name).join(', '),
          status: "available",
          coverImage: article.image_url,
          stats: {
            views: article.views || 0,
            downloads: article.downloads || 0,
            shares: article.shares || 0
          },
          tags: article.tags || []
        }));

        console.log('Mapped Atlas chapters:', atlasChapters);
        return atlasChapters;
      } catch (err) {
        console.error("Failed to fetch Atlas articles:", err);
        toast.error("Erreur lors du chargement des articles");
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep inactive data for 30 minutes
  });
};
