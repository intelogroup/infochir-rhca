import { SearchBar } from "./SearchBar";
import { ArticleContent } from "./ArticleContent";
import { useArticlesState } from "./hooks/useArticlesState";
import { useArticlesQuery } from "./hooks/useArticlesQuery";
import { VirtualizedArticleList } from "./VirtualizedArticleList";
import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleGridProps {
  viewMode?: "grid" | "table";
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="w-full h-32" />
    ))}
  </div>
);

const ArticleGrid = memo(({ viewMode = "table" }: ArticleGridProps) => {
  console.time('ArticleGrid Render');
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
    console.time('Search Operation');
    console.log("Searching with filters:", { 
      searchTerm, 
      selectedCategory, 
      selectedSource, 
      selectedTags,
      selectedAuthors,
      titleFilter,
      date 
    });
    console.timeEnd('Search Operation');
  };

  console.timeEnd('ArticleGrid Render');

  if (isLoading) {
    return <LoadingSkeleton />;
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
      
      {viewMode === "grid" ? (
        <VirtualizedArticleList
          articles={filteredArticles}
          onTagClick={(tag) => {
            if (!selectedTags.includes(tag)) {
              setSelectedTags([...selectedTags, tag]);
            }
          }}
          selectedTags={selectedTags}
        />
      ) : (
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
      )}
    </div>
  );
});

ArticleGrid.displayName = 'ArticleGrid';

export { ArticleGrid };