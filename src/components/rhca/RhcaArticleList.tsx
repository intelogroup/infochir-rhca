import { useState } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { SORT_OPTIONS } from "@/types/sortOptions";
import type { Article } from "@/types/article";

interface RhcaArticleListProps {
  articles: Article[];
  viewMode?: "grid" | "table";
}

export const RhcaArticleList = ({ articles, viewMode = "grid" }: RhcaArticleListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
  };

  return (
    <div className="space-y-4">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={handleSortChange}
        sortOptions={SORT_OPTIONS}
      />
      
      {/* Render articles based on viewMode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map(article => (
            <div key={article.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{article.title}</h3>
              <p>{article.abstract}</p>
            </div>
          ))}
        </div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Abstract</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id}>
                <td className="border px-4 py-2">{article.title}</td>
                <td className="border px-4 py-2">{article.abstract}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
