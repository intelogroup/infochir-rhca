
/// <reference types="vite/client" />

// Fix for import errors in IssuesGridLayout
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
