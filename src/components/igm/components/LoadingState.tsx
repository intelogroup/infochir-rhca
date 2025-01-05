import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-8 w-24" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-[200px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};