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
    try {
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

      const { data, error } = await Promise.race([
        query.abortSignal(signal),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("La requête a expiré. Veuillez réessayer.")), 30000)
        )
      ]) as { data: ArticleWithRelations[] | null; error: Error | null };

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Aucun article trouvé");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          throw new Error("Problème de connexion. Veuillez vérifier votre connexion internet.");
        }
        if (error.message.includes("expiré")) {
          throw new Error("La requête a pris trop de temps. Veuillez réessayer.");
        }
        throw error;
      }
      throw new Error("Une erreur inattendue est survenue. Veuillez réessayer.");
    }
  }, [searchTerm, selectedCategory, selectedSource, date]);

  const { 
    data: filteredArticles = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['articles', searchTerm, selectedCategory, selectedSource, date],
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching articles:', error);
        toast.error(error.message || 'Une erreur est survenue lors de la recherche');
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