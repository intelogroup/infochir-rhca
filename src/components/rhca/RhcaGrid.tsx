
import React, { useMemo } from 'react';
import { RhcaCard } from './RhcaCard';
import { RhcaTable } from './RhcaTable';
import type { RhcaArticle } from './types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {viewMode === "grid" ? (
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <ScrollArea className="w-full">
            <div 
              ref={scrollRef}
              className="flex space-x-6 py-4 px-8 overflow-x-auto" 
              style={{ minWidth: "100%" }}
            >
              {filteredArticles.map((article) => (
                <div key={article.id} className="w-[300px] flex-shrink-0">
                  <RhcaCard article={article} />
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
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
