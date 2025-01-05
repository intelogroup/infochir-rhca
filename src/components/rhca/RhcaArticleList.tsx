import { useState } from "react";
import { RhcaArticle } from "./types";
import { SearchAndSort } from "../issues/SearchAndSort";
import { SORT_OPTIONS, type SortOption, type SortOptionType } from "@/types/sortOptions";

interface RhcaArticleListProps {
  articles: RhcaArticle[];
  onArticleClick?: (article: RhcaArticle) => void;
}

export const RhcaArticleList = ({ articles, onArticleClick }: RhcaArticleListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.authors.some(author => 
      author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "downloads":
        return (b.downloads || 0) - (a.downloads || 0);
      case "shares":
        return (b.shares || 0) - (a.shares || 0);
      case "year":
        return new Date(b.date).getFullYear() - new Date(a.date).getFullYear();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        sortBy={sortBy}
        onSort={setSortBy}
        sortOptions={SORT_OPTIONS}
      />
      
      <div className="space-y-4">
        {sortedArticles.map((article) => (
          <div
            key={article.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onArticleClick?.(article)}
          >
            <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{article.authors.join(", ")}</p>
            <p className="text-sm text-gray-500">
              Page {article.pageNumber} • Volume {article.volume}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};