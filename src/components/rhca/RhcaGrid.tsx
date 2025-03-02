
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
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center">
                  <span className="text-lg font-semibold">{year}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({articlesByYear[year]?.length || 0} articles)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 py-3">
                  <ScrollArea className="w-full">
                    <div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-4" 
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
