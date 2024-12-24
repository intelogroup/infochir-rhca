import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { SearchBar } from "./index-medicus/SearchBar";
import { ArticleCard } from "./index-medicus/ArticleCard";
import { categories, sources, mockArticles } from "./index-medicus/constants";
import type { Article } from "./index-medicus/types";

export const IndexMedicusGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [selectedSource, setSelectedSource] = useState("Toutes les sources");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(), 1),
  });
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(mockArticles);

  const handleSearch = () => {
    const filtered = mockArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        article.abstract.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "Toutes les catégories" || 
        article.category === selectedCategory;
      
      const matchesSource = selectedSource === "Toutes les sources" ||
        article.source === selectedSource;
      
      const articleDate = new Date(article.date);
      const matchesDate = !date?.from || !date?.to || 
        (articleDate >= date.from && articleDate <= date.to);

      return matchesSearch && matchesCategory && matchesSource && matchesDate;
    });

    setFilteredArticles(filtered);
  };

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

      <div className="grid gap-6">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};