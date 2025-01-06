import { SearchBar } from "./SearchBar";
import { ArticleContent } from "./ArticleContent";
import { useArticlesState } from "./hooks/useArticlesState";
import { useArticlesQuery } from "./hooks/useArticlesQuery";
import { VirtualizedArticleList } from "./VirtualizedArticleList";

interface ArticleGridProps {
  viewMode?: "grid" | "table";
}

export const ArticleGrid = ({ viewMode = "table" }: ArticleGridProps) => {
  const { data: articles, isLoading } = useArticlesQuery();

  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    selectedTags,
    setSelectedTags,
    selectedAuthors,
    setSelectedAuthors,
    titleFilter,
    setTitleFilter,
    date,
    setDate,
    filteredArticles,
    categories,
    sources,
    availableTags,
    availableAuthors,
    articleStats
  } = useArticlesState(articles || []);

  const handleSearch = () => {
    console.log("Searching with filters:", { 
      searchTerm, 
      selectedCategory, 
      selectedSource, 
      selectedTags,
      selectedAuthors,
      titleFilter,
      date 
    });
  };

  if (viewMode === "grid") {
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
          selectedAuthors={selectedAuthors}
          setSelectedAuthors={setSelectedAuthors}
          titleFilter={titleFilter}
          setTitleFilter={setTitleFilter}
          date={date}
          setDate={setDate}
          onSearch={handleSearch}
          categories={categories}
          sources={sources}
          availableTags={availableTags}
          availableAuthors={availableAuthors}
          articleStats={articleStats}
        />
        
        <VirtualizedArticleList
          articles={filteredArticles}
          onTagClick={(tag) => {
            if (!selectedTags.includes(tag)) {
              setSelectedTags([...selectedTags, tag]);
            }
          }}
          selectedTags={selectedTags}
        />
      </div>
    );
  }

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
        selectedAuthors={selectedAuthors}
        setSelectedAuthors={setSelectedAuthors}
        titleFilter={titleFilter}
        setTitleFilter={setTitleFilter}
        date={date}
        setDate={setDate}
        onSearch={handleSearch}
        categories={categories}
        sources={sources}
        availableTags={availableTags}
        availableAuthors={availableAuthors}
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