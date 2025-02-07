
import { SearchBar } from "./SearchBar";
import { ArticleContent } from "./ArticleContent";
import { useArticlesState } from "./hooks/useArticlesState";
import { useArticlesQuery } from "./hooks/useArticlesQuery";
import { VirtualizedArticleList } from "./VirtualizedArticleList";
import { memo, useState, Suspense } from "react";
import { LoadingSpinner, LoadingSkeleton } from "./components/LoadingState";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Pagination } from "./components/Pagination";

interface ArticleGridProps {
  viewMode?: "grid" | "table";
}

const ArticleGrid = memo(({ viewMode = "table" }: ArticleGridProps) => {
  console.log('ArticleGrid rendering with viewMode:', viewMode);
  
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, error } = useArticlesQuery(currentPage);
  
  console.log('ArticleGrid query state:', { isLoading, error, hasData: !!data });
  
  const articles = data?.articles || [];
  const totalPages = data?.totalPages || 0;

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
    setCurrentPage(0); // Reset to first page when searching
    console.timeEnd('Search Operation');
  };

  if (error) {
    return <ErrorDisplay error={error as Error} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
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
      
      <Suspense fallback={<LoadingSkeleton />}>
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
      </Suspense>

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
