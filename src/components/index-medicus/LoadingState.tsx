import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  viewMode: 'grid' | 'table';
}

export const LoadingState = ({ viewMode }: LoadingStateProps) => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      {viewMode === 'table' ? (
        <div className="space-y-2">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={`header-${i}`} className="h-8" />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={`row-${i}`} className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <Skeleton key={`cell-${i}-${j}`} className="h-12" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={`card-${i}`} className="h-64" />
          ))}
        </div>
      )}
    </div>
  );
};