
import React from "react";
import { YearGroupList } from "./YearGroupList";
import { IssuesTable } from "../../issues/IssuesTable";
import { LoadingState } from "./LoadingState";
import { MobileOptimizedContainer } from "@/components/mobile/MobileOptimizedContainer";
import { Button } from "@/components/ui/button";
import type { Issue } from "../types";

interface IssuesGridContentProps {
  viewMode?: "grid" | "table";
  sortedIssues: Issue[];
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
  isLoading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const IssuesGridContent: React.FC<IssuesGridContentProps> = ({
  viewMode = "grid",
  sortedIssues = [],
  issuesByYear = {},
  sortedYears = [],
  isLoading,
  onLoadMore,
  hasMore = false
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!sortedIssues || sortedIssues.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun numéro trouvé</p>
        <p className="text-gray-400 text-sm mt-2">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    );
  }

  const renderContent = () => {
    if (viewMode === "table") {
      return <IssuesTable issues={sortedIssues} />;
    }

    return (
      <YearGroupList 
        issuesByYear={issuesByYear} 
        sortedYears={sortedYears} 
      />
    );
  };

  return (
    <MobileOptimizedContainer className="space-y-6">
      {renderContent()}
      
      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={onLoadMore} variant="outline">
            Charger plus
          </Button>
        </div>
      )}
    </MobileOptimizedContainer>
  );
};
