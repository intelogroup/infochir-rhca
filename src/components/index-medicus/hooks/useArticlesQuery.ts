import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "../types";

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

      // Map database response to match Article type
      return data.map((article): Article => ({
        ...article,
        date: article.publication_date,
        authors: article.authors || [],
        tags: article.tags || [],
        views: article.views || 0,
        citations: article.citations || 0,
        downloads: article.downloads || 0,
        source: article.source as "RHCA" | "IGM" | "ADC" // Type assertion for source
      }));
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes (formerly cacheTime)
  });
};