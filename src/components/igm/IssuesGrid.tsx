import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { IssuesGridLayout } from "./components/layout/IssuesGridLayout";

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid = ({ viewMode = "grid" }: IssuesGridProps) => {
  return (
    <ErrorBoundary>
      <IssuesGridLayout viewMode={viewMode} />
    </ErrorBoundary>
  );
};