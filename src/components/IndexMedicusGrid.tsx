import { useState, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { SearchBar } from "./index-medicus/SearchBar";
import { ArticleCard } from "./index-medicus/ArticleCard";
import { categories, sources } from "./index-medicus/constants";
import type { ArticleWithRelations } from "@/types/article";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const IndexMedicusGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [selectedSource, setSelectedSource] = useState("Toutes les sources");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(), 1),
  });
  const [filteredArticles, setFilteredArticles] = useState<ArticleWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          category:categories(name),
          article_authors(author:authors(name)),
          article_tags(tag:tags(name))
        `);

      // Apply filters
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

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      setFilteredArticles(data || []);
    } catch (error) {
      console.error('Error in handleSearch:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedSource, date]);

  return (
    <div className="space-y-6">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        date={date}
        setDate={setDate}
        onSearch={handleSearch}
        categories={categories}
        sources={sources}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun article trouvé
            </div>
          ) : (
            filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      )}
    </div>
  );
};