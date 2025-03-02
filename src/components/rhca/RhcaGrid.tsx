import React from 'react';
import { RhcaCard } from './RhcaCard';
import { RhcaTable } from './RhcaTable';
import type { RhcaArticle } from './types';

interface RhcaGridProps {
  articles: RhcaArticle[];
  viewMode: "grid" | "table";
}

export const RhcaGrid: React.FC<RhcaGridProps> = ({ articles, viewMode }) => {
  const filteredArticles = articles;

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
          searchQuery=""
          onSearchChange={() => {}}
        />
      )}
    </div>
  );
};
