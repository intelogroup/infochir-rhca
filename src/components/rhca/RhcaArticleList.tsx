import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { RhcaCard } from "./RhcaCard";
import { RhcaTable } from "./RhcaTable";
import { toast } from "@/hooks/use-toast";
import type { RhcaVolume } from "./types";

interface RhcaArticleListProps {
  volume: RhcaVolume;
  viewMode?: "grid" | "table";
}

export const RhcaArticleList = ({ volume, viewMode = "grid" }: RhcaArticleListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

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

  const sortArticles = (articles: typeof volume.articles, sortType: string) => {
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
        onSort={setSortBy}
        sortOptions={[
          { value: "latest", label: "Plus récents" },
          { value: "views", label: "Plus vus" },
          { value: "citations", label: "Plus cités" },
        ]}
      />
      
      {viewMode === "grid" ? (
        <div className="grid gap-6">
          {sortedArticles.map((article) => (
            <RhcaCard
              key={article.id}
              article={article}
            />
          ))}
        </div>
      ) : (
        <RhcaTable articles={sortedArticles} />
      )}
    </div>
  );
};