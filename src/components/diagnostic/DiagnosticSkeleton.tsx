import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DiagnosticSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] relative">
        <Skeleton className="absolute inset-0" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </Card>
  );
};