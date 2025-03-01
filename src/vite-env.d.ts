
/// <reference types="vite/client" />

// Fix for IGM components
declare module '@/components/igm/components/IssuesSearch';
declare module '@/hooks/useIssuesState';
declare module '@/constants/sortOptions';
declare module '@/hooks/useIGMIssues';

// Original declarations
declare module '../IssuesSearch';
declare module '../../hooks/useIssuesState';
declare module '../../constants/sortOptions';
declare module '../../hooks/useIGMIssues';
