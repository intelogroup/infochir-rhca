import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { IssuesGridLayout } from "./components/IssuesGridLayout";

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid = (props: IssuesGridProps) => {
  return (
    <ErrorBoundary>
      <IssuesGridLayout {...props} />
    </ErrorBoundary>
  );
};