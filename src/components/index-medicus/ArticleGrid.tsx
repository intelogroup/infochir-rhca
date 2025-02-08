
import { SearchBar } from "./SearchBar";
import { ArticleContent } from "./ArticleContent";
import { useArticlesState } from "./hooks/useArticlesState";
import { useArticlesQuery } from "./hooks/useArticlesQuery";
import { VirtualizedArticleList } from "./VirtualizedArticleList";
import { memo, useState, useCallback } from "react";
import { LoadingSpinner } from "./components/LoadingState";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Pagination } from "./components/Pagination";

interface ArticleGridProps {
  viewMode?: "grid" | "table";
}

const ArticleGrid = memo(({ viewMode = "table" }: ArticleGridProps) => {
  console.log('ArticleGrid rendering with viewMode:', viewMode);
  
  // 1. Initialize page state
  const [currentPage, setCurrentPage] = useState(0);
  
  // 2. Fetch data
  const { data, isLoading, error } = useArticlesQuery(currentPage);
  console.log('ArticleGrid query state:', { isLoading, error, hasData: !!data });
  
  const articles = data?.articles || [];
  const totalPages = data?.totalPages || 0;

  // 3. Initialize article state after data is available
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
  } = useArticlesState(articles);

  // 4. Error handling
  if (error) {
    return <ErrorDisplay error={error as Error} />;
  }

  // 5. Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSearch = useCallback(() => {
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
    setCurrentPage(0); // Reset to first page when searching
    console.timeEnd('Search Operation');
  }, [
    searchTerm, 
    selectedCategory, 
    selectedSource, 
    selectedTags,
    selectedAuthors,
    titleFilter,
    date
  ]);

  const handleTagClick = useCallback((tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  }, [selectedTags, setSelectedTags]);

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
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
        />
      ) : (
        <ArticleContent
          viewMode={viewMode}
          articles={filteredArticles}
          isLoading={isLoading}
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
});

ArticleGrid.displayName = 'ArticleGrid';

export { ArticleGrid };

