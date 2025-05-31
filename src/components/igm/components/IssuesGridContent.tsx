
import React from "react";
import { IssueCard } from "../IssueCard";
import { LoadingState } from "./LoadingState";
import { MobileOptimizedContainer } from "@/components/mobile/MobileOptimizedContainer";
import type { Issue } from "../types";

interface IssuesGridContentProps {
  issues: Issue[];
  isLoading: boolean;
  error: Error | null;
  onRefresh?: () => Promise<void>;
}

export const IssuesGridContent: React.FC<IssuesGridContentProps> = ({
  issues,
  isLoading,
  error,
  onRefresh
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Erreur lors du chargement des numéros</p>
        <button 
          onClick={onRefresh}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun numéro trouvé</p>
        <p className="text-gray-400 text-sm mt-2">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    );
  }

  return (
    <MobileOptimizedContainer 
      onRefresh={onRefresh}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </MobileOptimizedContainer>
  );
};
