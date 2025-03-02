
import React, { useMemo } from 'react';
import { RhcaCard } from './RhcaCard';
import { RhcaTable } from './RhcaTable';
import type { RhcaArticle } from './types';

interface RhcaGridProps {
  articles: RhcaArticle[];
  viewMode: "grid" | "table";
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const RhcaGrid: React.FC<RhcaGridProps> = ({ 
  articles, 
  viewMode,
  searchQuery,
  onSearchChange
}) => {
  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    
    const query = searchQuery.toLowerCase().trim();
    return articles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      (article.abstract && article.abstract.toLowerCase().includes(query)) ||
      (article.authors && article.authors.some(author => 
        typeof author === 'string' && author.toLowerCase().includes(query)
      )) ||
      (article.tags && article.tags.some(tag => 
        tag.toLowerCase().includes(query)
      ))
    );
  }, [articles, searchQuery]);

  return (
    <div className="grid grid-cols-1 gap-6">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <RhcaCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <RhcaTable 
          articles={filteredArticles} 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      )}
    </div>
  );
};
