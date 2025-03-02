
import React, { useState, useEffect } from 'react';
import { RhcaCard } from "@/components/rhca/RhcaCard";
import { RhcaTable } from "@/components/rhca/RhcaTable";
import { IssueCard } from "@/components/igm/IssueCard";
import { IndexMedicusCard } from "@/components/index-medicus/IndexMedicusCard";
import type { RhcaArticle } from "@/components/rhca/types";
import type { Issue } from "@/components/igm/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {variant === 'index-medicus' && articles.length > 0 && (
        <div>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              {/* Table view for Index Medicus articles can be implemented here */}
              <div className="bg-white p-6 text-center">
                <p>Table view not yet implemented for Index Medicus</p>
              </div>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rhcaArticles.map((article) => (
                <RhcaCard key={article.id} article={article} />
              ))}
            </div>
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
