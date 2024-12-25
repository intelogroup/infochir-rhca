import { useState, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { ArticleWithRelations } from "@/types/article";

export const useIndexMedicusSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [selectedSource, setSelectedSource] = useState("Toutes les sources");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(), 1),
  });
  const [filteredArticles, setFilteredArticles] = useState<ArticleWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
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
      }

      if (selectedCategory !== "Toutes les catégories") {
        query = query.eq('category.name', selectedCategory);
      }

      if (date?.from && date?.to) {
        query = query.gte('date', date.from.toISOString())
                    .lte('date', date.to.toISOString());
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setFilteredArticles(data || []);
    } catch (err) {
      console.error('Error in handleSearch:', err);
      setError('Une erreur est survenue lors de la recherche');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedSource, date]);

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