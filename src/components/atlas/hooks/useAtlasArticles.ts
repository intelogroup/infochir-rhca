
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtlasChapter } from "../types";

export const useAtlasArticles = () => {
  return useQuery({
    queryKey: ["atlas-chapters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atlas_unified_view")
        .select("*")
        .order("publication_date", { ascending: false });

      if (error) {
        console.error("Error fetching atlas chapters:", error);
        throw error;
      }

      const chapters: AtlasChapter[] = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        abstract: item.abstract,
        content: item.content,
        lastUpdate: item.updated_at,
        publicationDate: item.publication_date,
        author: item.author,
        authors: item.authors,
        status: item.status || "available",
        coverImage: item.cover_image,
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
        imageUrls: item.image_urls,
        institution: item.institution,
        userId: item.user_id
      })) || [];

      return chapters;
    }
  });
};
