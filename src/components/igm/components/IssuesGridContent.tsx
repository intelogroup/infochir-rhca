import { YearGroupList } from "./YearGroupList";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { FileText, Search } from "lucide-react";
import type { Issue } from "../types";
import { IssueCardSkeleton } from "./IssueCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useInView } from "framer-motion";
import { useRef, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";

// Memoize the loading state component for better performance
const LoadingState = memo(() => (
  <motion.div 
    className="space-y-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }} // Reduced animation duration
  >
    {[1, 2].map((year) => (
      <div key={year} className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <IssueCardSkeleton key={i} />
          ))}
        </div>
      </div>
    ))}
  </motion.div>
));

LoadingState.displayName = 'LoadingState';

// Memoize the empty state component
const EmptyState = memo(() => (
  <motion.div 
    className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-xl border border-gray-100 text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
    role="status"
    aria-live="polite"
  >
    <div className="bg-secondary/10 p-4 rounded-full mb-4">
      <Search className="h-8 w-8 text-secondary-foreground/70" aria-hidden="true" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun numéro trouvé</h3>
    <p className="text-sm text-gray-500 max-w-md">
      Nous n'avons trouvé aucun numéro correspondant à vos critères de recherche. 
      Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche.
    </p>
  </motion.div>
));

EmptyState.displayName = 'EmptyState';

interface IssuesGridContentProps {
  viewMode: "grid" | "table";
  sortedIssues: Issue[];
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export const IssuesGridContent = memo(({
  viewMode,
  sortedIssues,
  issuesByYear,
  sortedYears,
  isLoading,
  onLoadMore,
  hasMore,
}: IssuesGridContentProps) => {
  console.time('IssuesGridContent render');
  
  const parentRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef, {
    once: false,
    amount: 0.5,
  });

  const rowVirtualizer = useVirtualizer({
    count: sortedYears.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400, // Estimate height for each year group
    overscan: 2,
  });

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isInView, hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    console.timeEnd('IssuesGridContent render');
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (sortedIssues.length === 0) {
    return <EmptyState />;
  }

  if (viewMode === "grid") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full"
          ref={parentRef}
          style={{
            height: '800px',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const year = sortedYears[virtualRow.index];
              const issues = issuesByYear[year];

              return (
                <div
                  key={year}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <YearGroupList
                    issuesByYear={{ [year]: issues }}
                    sortedYears={[year]}
                  />
                </div>
              );
            })}
          </div>
          
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={onLoadMore}
                className="animate-pulse"
              >
                Charger plus de numéros
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return <IssuesTable issues={sortedIssues} />;
});

IssuesGridContent.displayName = 'IssuesGridContent';