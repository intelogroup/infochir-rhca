import { MainLayout } from "@/components/layouts/MainLayout";
import { IndexMedicusHeader } from "@/components/index-medicus/IndexMedicusHeader";
import { SearchBar } from "@/components/index-medicus/SearchBar";
import { ArticleCard } from "@/components/index-medicus/ArticleCard";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { categories, sources, mockArticles } from "@/components/index-medicus/constants";

const IndexMedicus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [selectedSource, setSelectedSource] = useState("Toutes les sources");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>();

  // Get unique tags from all articles
  const availableTags = Array.from(
    new Set(mockArticles.flatMap(article => article.tags))
  );

  const handleSearch = () => {
    // Filter articles based on search criteria
    let filteredArticles = [...mockArticles];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.authors.some(author => author.toLowerCase().includes(searchLower)) ||
        article.abstract.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory !== "Toutes les catégories") {
      filteredArticles = filteredArticles.filter(article =>
        article.category === selectedCategory
      );
    }

    if (selectedSource !== "Toutes les sources") {
      filteredArticles = filteredArticles.filter(article =>
        article.source === selectedSource
      );
    }

    if (selectedTags.length > 0) {
      filteredArticles = filteredArticles.filter(article =>
        selectedTags.some(tag => article.tags.includes(tag))
      );
    }

    if (date?.from && date?.to) {
      filteredArticles = filteredArticles.filter(article => {
        const articleDate = new Date(article.date);
        return articleDate >= date.from && articleDate <= date.to;
      });
    }

    return filteredArticles;
  };

  const filteredArticles = handleSearch();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <IndexMedicusHeader />
        
        <div className="mt-8">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            date={date}
            setDate={setDate}
            onSearch={handleSearch}
            categories={categories}
            sources={sources}
            availableTags={availableTags}
          />
        </div>

        <div className="mt-8 space-y-6">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Aucun article trouvé</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default IndexMedicus;