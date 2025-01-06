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

      return data as Article[];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache for 30 minutes
  });
};