import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const IssueCardSkeleton = () => {
  return (
    <Card className="h-full bg-white border border-gray-100">
      <div className="flex flex-col sm:flex-row h-full animate-pulse">
        <div className="w-full sm:w-24 md:w-28 lg:w-32 flex-shrink-0">
          <div className="aspect-[3/4] bg-gray-200 rounded-l" />
        </div>
        
        <div className="flex-1 p-3 sm:p-4 lg:p-6 flex flex-col min-w-0">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4 mt-2" />
              <Skeleton className="h-5 w-1/3 mt-2" />
            </div>

            <Skeleton className="h-16 w-full" />

            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="flex gap-2 mt-auto">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};