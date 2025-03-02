
import React, { useMemo } from 'react';
import { RhcaCard } from './RhcaCard';
import { RhcaTable } from './RhcaTable';
import type { RhcaArticle } from './types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useArticlesState } from './hooks/useArticlesState';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

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

  // Group articles by year
  const { articlesByYear, years } = useArticlesState(filteredArticles);

  return (
    <div className="grid grid-cols-1 gap-6">
      {viewMode === "grid" ? (
        <Accordion type="multiple" defaultValue={years.map(year => year.toString())} className="space-y-4">
          {years.map(year => (
            <AccordionItem key={year} value={year.toString()} className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50">
                <div className="flex items-center">
                  <span className="text-base sm:text-lg font-semibold">{year}</span>
                  <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                    ({articlesByYear[year]?.length || 0} articles)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-2 sm:px-4 py-2 sm:py-3">
                  <ScrollArea className="w-full max-h-[70vh]">
                    <div 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-2 sm:py-4 px-2 sm:px-4" 
                    >
                      {articlesByYear[year]?.map((article) => (
                        <div key={article.id}>
                          <RhcaCard article={article} />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
