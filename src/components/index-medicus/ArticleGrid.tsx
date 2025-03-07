
import { SearchBar } from "./SearchBar";
import { ArticleContent } from "./ArticleContent";
import { useArticlesState } from "./hooks/useArticlesState";
import { useArticlesQuery } from "./hooks/useArticlesQuery";
import { VirtualizedArticleList } from "./VirtualizedArticleList";
import { FC, useState, useCallback } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Pagination } from "./components/Pagination";

interface ArticleGridProps {
  viewMode?: "grid" | "table";
}

const ArticleGrid: FC<ArticleGridProps> = ({ viewMode = "table" }) => {
  console.log('ArticleGrid rendering with viewMode:', viewMode);
  
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, error, refetch } = useArticlesQuery(currentPage);
  
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

  const handleSearch = useCallback(async () => {
    try {
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
      
      await setCurrentPage(0);
      console.timeEnd('Search Operation');
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [
    searchTerm, 
    selectedCategory, 
    selectedSource, 
    selectedTags,
    selectedAuthors,
    titleFilter,
    date,
    setCurrentPage
  ]);

  const handleTagClick = useCallback((tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  }, [selectedTags, setSelectedTags]);

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return <ErrorDisplay error={error as Error} onRetry={handleRetry} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-10">
        <LoadingSpinner size="lg" variant="default" text="Chargement des articles..." />
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
};

ArticleGrid.displayName = 'ArticleGrid';

export { ArticleGrid };
