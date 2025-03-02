
import React, { useState } from "react";
import { Issue } from "../types";
import { IssueCard } from "../IssueCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YearGroupListProps {
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
}

export const YearGroupList = ({ issuesByYear, sortedYears }: YearGroupListProps) => {
  const [collapsedYears, setCollapsedYears] = useState<Record<number, boolean>>({});

  const toggleYearCollapse = (year: number) => {
    setCollapsedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-primary">Info Gazette Médicale</h2>
      </div>
      
      {sortedYears.map((year) => (
        <div key={year} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{year}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => toggleYearCollapse(year)}
              aria-label={collapsedYears[year] ? "Expand year" : "Collapse year"}
            >
              {collapsedYears[year] ? (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </div>
          
          {!collapsedYears[year] && (
            <div className="flex flex-col gap-6">
              {issuesByYear[year].map((issue) => (
                <div key={issue.id}>
                  <IssueCard key={issue.id} issue={issue} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
