import { useState, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { ArticleWithRelations } from "@/types/article";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const useIndexMedicusSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [selectedSource, setSelectedSource] = useState("Toutes les sources");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(), 1),
  });

  const fetchArticles = useCallback(async ({ signal }: { signal?: AbortSignal } = {}) => {
    let query = supabase
      .from('articles')
      .select(`
        *,
        category:categories(name),
        article_authors(author:authors(name)),
        article_tags(tag:tags(name))
      `);

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,abstract.ilike.%${searchTerm}%`);
    }

    if (selectedSource !== "Toutes les sources") {
      query = query.eq('source', selectedSource);
    } else {
      query = query.in('source', ['RHCA', 'IGM']);
    }

    if (selectedCategory !== "Toutes les catégories") {
      query = query.eq('category.name', selectedCategory);
    }

    if (date?.from && date?.to) {
      query = query.gte('date', date.from.toISOString())
                  .lte('date', date.to.toISOString());
    }

    const { data, error } = await query.abortSignal(signal);

    if (error) {
      throw error;
    }

    return data || [];
  }, [searchTerm, selectedCategory, selectedSource, date]);

  const { 
    data: filteredArticles = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['articles', searchTerm, selectedCategory, selectedSource, date],
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data in cache for 10 minutes
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching articles:', error);
        toast.error('Une erreur est survenue lors de la recherche');
      }
    }
  });

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    date,
    setDate,
    filteredArticles,
    isLoading,
    error,
    handleSearch,
  };
};