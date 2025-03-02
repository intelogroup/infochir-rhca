
import React, { useState } from 'react';
import { RHCASidebar } from './components/RHCASidebar';
import { RhcaGrid } from './RhcaGrid';
import { useRHCAArticles } from './hooks/useRHCAArticles';
import { Button } from "@/components/ui/button";
import { Grid2X2, List } from "lucide-react";
import type { RhcaArticle } from './types';

export const RhcaContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const { articles, loading, error } = useRHCAArticles();
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === "grid" ? "table" : "grid");
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Articles RHCA</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              aria-label={viewMode === "grid" ? "Switch to table view" : "Switch to grid view"}
            >
              {viewMode === "grid" ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid2X2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Une erreur est survenue lors du chargement des articles.
          </div>
        ) : (
          <RhcaGrid 
            articles={articles} 
            viewMode={viewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
      </div>
      
      <div className="lg:col-span-1">
        <RHCASidebar />
      </div>
    </div>
  );
};
