
import React, { useState } from 'react';
import { RHCASidebar } from './components/RHCASidebar';
import { RhcaGrid } from './RhcaGrid';
import { useRHCAArticles } from './hooks/useRHCAArticles';
import type { RhcaArticle } from './types';

export const RhcaContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { articles, loading, error } = useRHCAArticles();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <RhcaGrid 
          articles={articles} 
          viewMode={viewMode} 
        />
      </div>
      
      <div className="lg:col-span-1">
        <RHCASidebar />
      </div>
    </div>
  );
};
