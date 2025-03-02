
/// <reference types="vite/client" />

// Fix for import errors in IssuesGridLayout
declare module "@/components/igm/IssuesSearch" {
  const IssuesSearch: React.FC<any>;
  export default IssuesSearch;
}

declare module "@/components/igm/hooks/useIssuesState" {
  export const useIssuesState: (params: { 
    issues: any[]; 
    searchTerm: string; 
    sortBy: any; 
    dateRange: any; 
    selectedCategories: string[];
  }) => any;
}

declare module "@/components/igm/constants/sortOptions" {
  export const sortOptions: any[];
}

declare module "@/components/igm/hooks/useIGMIssues" {
  export const useIGMIssues: () => any;
}

declare module "@/components/igm/components/IssueCardSkeleton" {
  export const IssueCardSkeleton: React.FC<any>;
}

declare module "@/components/igm/components/IssuesGridContent" {
  export const IssuesGridContent: React.FC<any>;
}

