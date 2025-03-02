
import React from 'react';
import { IssueCard } from '../IssueCard';
import { Issue, IssueGroup } from '../types';
import IssueCardSkeleton from './IssueCardSkeleton';
import { sortOptions } from '../constants/sortOptions';
import { ArchiveIcon } from 'lucide-react';

interface IssueGridLayoutProps {
  isLoading: boolean;
  issueGroups: IssueGroup[];
  sortBy: string;
  searchTerm: string;
  activeYear: string | null;
  selectedIssue: Issue | null;
  handleIssueClick: (issue: Issue) => void;
}

export const IssuesGridLayout: React.FC<IssueGridLayoutProps> = ({
  isLoading,
  issueGroups,
  sortBy,
  searchTerm,
  activeYear,
  selectedIssue,
  handleIssueClick,
}) => {
  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <IssueCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // No issues found state
  if (issueGroups.length === 0 || issueGroups.every(group => group.issues.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <ArchiveIcon className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun numéro trouvé</h3>
        <p className="text-gray-500 max-w-md">
          {searchTerm
            ? `Aucun numéro ne correspond à "${searchTerm}"`
            : "Aucun numéro n'est disponible pour cette période."}
        </p>
      </div>
    );
  }

  // Display filtered issues
  return (
    <div className="space-y-8">
      {issueGroups.map((group) => (
        <div key={group.year}>
          {group.issues.length > 0 && (
            <div className="space-y-4">
              {!activeYear && (
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {group.year}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.issues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onClick={() => handleIssueClick(issue)}
                    isSelected={selectedIssue?.id === issue.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default IssuesGridLayout;
