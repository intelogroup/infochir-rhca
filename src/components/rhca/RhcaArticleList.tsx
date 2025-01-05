import { useState } from "react";
import { RhcaArticle, SortOption } from "./types";
import { SearchAndSort } from "../issues/SearchAndSort";
import { sortOptions } from "./constants";

interface RhcaArticleListProps {
  articles: RhcaArticle[];
  onArticleClick?: (article: RhcaArticle) => void;
}

export const RhcaArticleList = ({ articles, onArticleClick }: RhcaArticleListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.authors.some(author => 
      author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy.value) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "views":
        return (b.views || 0) - (a.views || 0);
      case "citations":
        return (b.citations || 0) - (a.citations || 0);
      case "downloads":
        return (b.downloads || 0) - (a.downloads || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
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