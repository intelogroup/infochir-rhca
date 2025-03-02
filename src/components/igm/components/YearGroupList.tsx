
import React from "react";
import { Issue } from "../types";
import { IssueCard } from "../IssueCard";

interface YearGroupListProps {
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
}

export const YearGroupList = ({ issuesByYear, sortedYears }: YearGroupListProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-bold text-primary">Info Gazette Médicale</h2>
      </div>
      
      {sortedYears.map((year) => (
        <div key={year} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issuesByYear[year].map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
