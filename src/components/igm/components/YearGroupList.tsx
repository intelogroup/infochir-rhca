import React, { useState, useMemo } from "react";
import { Issue } from "../types";
import { IssueCard } from "../IssueCard";
import { ChevronDown, ChevronUp, Share2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface YearGroupListProps {
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
}

export const YearGroupList = ({ issuesByYear = {}, sortedYears = [] }: YearGroupListProps) => {
  const [collapsedYears, setCollapsedYears] = useState<Record<number, boolean>>({});
  
  // Define all the years we want to display
  const allDisplayYears = useMemo(() => {
    // Start with current year and go back 5 years
    const currentYear = new Date().getFullYear();
    const defaultYears = [];
    for (let i = 0; i <= 5; i++) {
      defaultYears.push(currentYear - i);
    }
    
    // Combine with sorted years that have data
    const allYears = new Set([...sortedYears, ...defaultYears]);
    return Array.from(allYears).sort((a, b) => b - a);
  }, [sortedYears]);

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

  // Safety check for empty data
  if (!issuesByYear || Object.keys(issuesByYear).length === 0) {
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
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-primary">Info Gazette Médicale</h2>
      </div>
      
      {allDisplayYears.map((year) => {
        // Check if the year actually has issues
        const yearIssues = issuesByYear[year] || [];
        const hasIssues = yearIssues.length > 0;
        const issueCount = yearIssues.length;
        
        return (
          <div key={year} className="mb-10">
            <div 
              className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => toggleYearCollapse(year)}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{year}</h3>
                {!hasIssues && (
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded-full">
                    Aucun numéro
                  </span>
                )}
                {hasIssues && (
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded-full">
                    {issueCount === 1 ? "1 numéro" : `${issueCount} numéros`}
                  </span>
                )}
              </div>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleYearCollapse(year);
                  }}
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
              <div>
                {hasIssues ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {yearIssues.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                    <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-center">
                      Aucun numéro publié pour {year}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
