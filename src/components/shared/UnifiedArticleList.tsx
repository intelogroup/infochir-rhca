
import React, { useState, useEffect } from 'react';
import { RhcaCard } from "@/components/rhca/RhcaCard";
import { RhcaTable } from "@/components/rhca/RhcaTable";
import { IssueCard } from "@/components/igm/IssueCard";
import type { RhcaArticle } from "@/components/rhca/types";
import type { Issue } from "@/components/igm/types";

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
  selectedTags,
  isLoading,
}) => {
  return (
    <div>
      {variant === 'index-medicus' && articles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Render index-medicus articles */}
            {/* This will need to be implemented based on the article structure */}
            <p>Articles will be rendered here</p>
          </div>
        </div>
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
