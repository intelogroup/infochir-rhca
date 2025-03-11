
import React, { useState, useEffect } from 'react';
import { RhcaCard } from "@/components/rhca/RhcaCard";
import { RhcaTable } from "@/components/rhca/RhcaTable";
import { IssueCard } from "@/components/igm/IssueCard";
import { IndexMedicusCard } from "@/components/index-medicus/IndexMedicusCard";
import { ArticleTable } from "@/components/index-medicus/ArticleTable";
import type { RhcaArticle } from "@/components/rhca/types";
import type { Issue } from "@/components/igm/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface UnifiedArticleListProps {
  rhcaArticles?: RhcaArticle[];
  igmIssues?: Issue[];
  articles?: any[]; // Generic articles for IndexMedicus
  variant?: string;
  viewMode: "grid" | "table";
  onIssueClick?: (issue: Issue) => void;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
  isLoading?: boolean;
}

export const UnifiedArticleList: React.FC<UnifiedArticleListProps> = ({
  rhcaArticles = [],
  igmIssues = [],
  articles = [],
  viewMode,
  variant,
  onIssueClick = () => {},
  onTagClick,
  selectedTags = [],
  isLoading = false,
}) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="py-8 mt-[50px]">
        <LoadingSpinner variant="fun" text={variant === 'index-medicus' ? "Chargement des publications..." : "Chargement des données..."} />
      </div>
    );
  }

  return (
    <div>
      {variant === 'index-medicus' && articles.length > 0 && (
        <div>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {articles.map((article) => (
                <IndexMedicusCard 
                  key={article.id} 
                  article={article}
                  onTagClick={onTagClick}
                  isSelected={selectedTags?.some(tag => article.tags?.includes(tag))}
                />
              ))}
            </div>
          ) : (
            <ArticleTable 
              articles={articles}
              onTagClick={onTagClick}
              selectedTags={selectedTags}
            />
          )}
        </div>
      )}

      {variant === 'index-medicus' && articles.length === 0 && !isLoading && (
        <Alert variant="destructive" className="my-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Aucun article trouvé. Essayez de modifier vos critères de recherche.
          </AlertDescription>
        </Alert>
      )}

      {igmIssues.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">IGM Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {igmIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      )}

      {rhcaArticles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">RHCA Articles</h2>
          {viewMode === "grid" ? (
            <ScrollArea className={isMobile ? "h-[500px] pr-4" : "h-[600px] pr-4"}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-4">
                {rhcaArticles.map((article) => (
                  <RhcaCard key={article.id} article={article} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <RhcaTable 
              articles={rhcaArticles}
              searchQuery=""
              onSearchChange={() => {}}
            />
          )}
        </div>
      )}
    </div>
  );
};

