
import React, { useState } from 'react';
import { RHCASidebar } from './components/RHCASidebar';
import { RhcaGrid } from './RhcaGrid';
import { useRHCAArticles } from './hooks/useRHCAArticles';
import { Button } from "@/components/ui/button";
import { Grid2X2, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-[#41b06e]">Articles RHCA</h2>
          
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des articles..."
                className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              aria-label={viewMode === "grid" ? "Switch to table view" : "Switch to grid view"}
              className="md:ml-2 h-9 px-2.5 py-1.5 border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {viewMode === "grid" ? (
                <List className="h-4 w-4 text-gray-600" />
              ) : (
                <Grid2X2 className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="py-12">
            <LoadingSpinner variant="medical" text="Chargement des articles RHCA..." />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <div className="font-bold">Erreur</div>
            <div className="mt-1">Une erreur est survenue lors du chargement des articles.</div>
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
