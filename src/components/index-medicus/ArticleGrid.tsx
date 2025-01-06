import { SearchBar } from "./SearchBar";
import { ArticleContent } from "./ArticleContent";
import { useArticlesState } from "./hooks/useArticlesState";
import { mockArticles } from "./data/mockArticles";

interface ArticleGridProps {
  viewMode?: "grid" | "table";
}

export const ArticleGrid = ({ viewMode = "table" }: ArticleGridProps) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    selectedTags,
    setSelectedTags,
    date,
    setDate,
    filteredArticles,
    isLoading,
    categories,
    sources,
    availableTags,
    articleStats
  } = useArticlesState(mockArticles);

  const handleSearch = () => {
    // This will be handled by the useArticlesState hook
    console.log("Searching with filters:", { searchTerm, selectedCategory, selectedSource, selectedTags, date });
  };

  return (
    <div className="space-y-4">
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
        articleStats={articleStats}
      />
      
      <ArticleContent
        viewMode={viewMode}
        articles={filteredArticles}
        isLoading={isLoading}
        onTagClick={(tag) => {
          if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
          }
        }}
        selectedTags={selectedTags}
      />
    </div>
  );
};