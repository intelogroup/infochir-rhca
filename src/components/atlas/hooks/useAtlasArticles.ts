
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtlasChapter } from "../types";

export const useAtlasArticles = () => {
  return useQuery({
    queryKey: ["atlas-chapters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unified_content")
        .select("*")
        .eq('source', 'ADC')
        .order("publication_date", { ascending: false });

      if (error) {
        console.error("Error fetching atlas chapters:", error);
        throw error;
      }

      const chapters: AtlasChapter[] = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.abstract || undefined,
        abstract: item.abstract,
        content: item.abstract,
        lastUpdate: item.updated_at,
        publicationDate: item.publication_date,
        author: Array.isArray(item.authors) ? item.authors[0] : undefined,
        authors: Array.isArray(item.authors) ? item.authors : [],
        status: item.status === 'draft' ? 'coming' : 'available',
        coverImage: item.image_url,
        stats: {
          views: item.views || 0,
          shares: item.shares || 0,
          downloads: item.downloads || 0
        },
        tags: item.tags || [],
        volume: item.volume,
        specialty: item.specialty,
        category: item.category,
        source: "ADC",
        pdfUrl: item.pdf_url,
        imageUrls: [],
        institution: item.institution,
        userId: undefined
      })) || [];

      return chapters;
    }
  });
};
