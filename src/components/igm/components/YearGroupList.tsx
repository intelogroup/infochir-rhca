
import React, { useState } from "react";
import { Issue } from "../types";
import { IssueCard } from "../IssueCard";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  const handleShareYear = (year: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/igm?year=${year}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success(`Lien pour les numéros de ${year} copié dans le presse-papier`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-primary">Info Gazette Médicale</h2>
      </div>
      
      {sortedYears.map((year) => (
        <div key={year} className="mb-10">
          <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <h3 className="text-lg font-semibold">{year}</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-8 w-8 rounded-full hover:bg-gray-200"
                onClick={(e) => handleShareYear(year, e)}
                aria-label={`Partager les numéros de ${year}`}
              >
                <Share2 className="h-4 w-4 text-gray-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-8 w-8 rounded-full hover:bg-gray-200"
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
