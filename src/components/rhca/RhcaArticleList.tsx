import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { RhcaCard } from "./RhcaCard";
import { RhcaTable } from "./RhcaTable";
import { toast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import type { RhcaVolume } from "./types";
import { RHCA_SORT_OPTIONS, RHCASortOption } from "./constants/sortOptions";

interface RhcaArticleListProps {
  volume: RhcaVolume;
  viewMode?: "grid" | "table";
}

const RhcaArticleListContent = ({ volume, viewMode = "grid" }: RhcaArticleListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<RHCASortOption>("latest");

  const filteredArticles = useMemo(() => {
    const filtered = volume.articles.filter((article) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        article.title.toLowerCase().includes(searchLower) ||
        article.abstract.toLowerCase().includes(searchLower) ||
        article.authors.some(author => 
          author.toLowerCase().includes(searchLower)
        ) ||
        (article.tags && article.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        ))
      );
    });

    if (filtered.length === 0 && searchTerm !== "") {
      toast({
        title: "Aucun résultat",
        description: "Essayez de modifier vos critères de recherche",
        variant: "destructive",
      });
    }

    return filtered;
  }, [searchTerm, volume.articles]);

  const sortArticles = (articles: typeof volume.articles, sortType: RHCASortOption) => {
    let sorted = [...articles];
    switch (sortType) {
      case "latest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "views":
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "citations":
        sorted.sort((a, b) => (b.citations || 0) - (a.citations || 0));
        break;
      default:
        break;
    }
    return sorted;
  };

  const sortedArticles = sortArticles(filteredArticles, sortBy);

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={(value) => setSortBy(value as RHCASortOption)}
        sortOptions={RHCA_SORT_OPTIONS}
      />
      
      {viewMode === "grid" ? (
        <div className="grid gap-6">
          {sortedArticles.map((article) => (
            <ErrorBoundary key={article.id}>
              <RhcaCard article={article} />
            </ErrorBoundary>
          ))}
        </div>
      ) : (
        <ErrorBoundary>
          <RhcaTable articles={sortedArticles} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export const RhcaArticleList = (props: RhcaArticleListProps) => {
  return (
    <ErrorBoundary>
      <RhcaArticleListContent {...props} />
    </ErrorBoundary>
  );
};