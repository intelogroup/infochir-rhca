
/// <reference types="vite/client" />

// Fix for import errors in IssuesGridLayout
declare module "@/components/igm/IssuesSearch" {
  const IssuesSearch: React.FC<any>;
  export default IssuesSearch;
}

declare module "@/hooks/useIssuesState" {
  export const useIssuesState: () => any;
}

declare module "@/constants/sortOptions" {
  export const sortOptions: any[];
}

declare module "@/hooks/useIGMIssues" {
  export const useIGMIssues: () => any;
}

// Added necessary module declarations for IssuesGridLayout imports
declare module "@/components/igm/components/IssuesSearch" {
  const IssuesSearch: React.FC<any>;
  export default IssuesSearch;
}

declare module "@/components/igm/hooks/useIssuesState" {
  export const useIssuesState: () => any;
}

declare module "@/components/igm/constants/sortOptions" {
  export const sortOptions: any[];
}

declare module "@/components/igm/hooks/useIGMIssues" {
  export const useIGMIssues: () => any;
}
