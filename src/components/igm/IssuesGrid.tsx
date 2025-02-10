
import * as React from "react";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { IssuesGridLayout } from "./components/layout/IssuesGridLayout";

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid: React.FC<IssuesGridProps> = ({ viewMode = "grid" }) => {
  return (
    <ErrorBoundary>
      <IssuesGridLayout viewMode={viewMode} />
    </ErrorBoundary>
  );
};

