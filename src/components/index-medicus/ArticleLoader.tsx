
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertTriangle, RefreshCcw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useRetry } from "@/hooks/useRetry";
import { useLoadingState } from "@/hooks/useLoadingState";
import { handleError, createRetryConfig } from "@/utils/errorHandling";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ArticleLoaderProps<T> {
  queryKey: string | string[];
  queryFn: () => Promise<T>;
  children: (data: T) => React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  loadingText?: string;
  context?: string;
  staleTime?: number;
  gcTime?: number;
  maxRetries?: number;
}

export function ArticleLoader<T>({
  queryKey,
  queryFn,
  children,
  loadingFallback,
  errorFallback,
  emptyFallback,
  loadingText = "Chargement des articles...",
  context = "article-loader",
  staleTime = 5 * 60 * 1000,
  gcTime = 30 * 60 * 1000,
  maxRetries = 3
}: ArticleLoaderProps<T>) {
  const { retry, attemptCount, isRetrying, resetRetry } = useRetry({
    maxRetries,
    onRetry: (attempt) => console.log(`[${context}] Retry attempt ${attempt}/${maxRetries}`)
  });

  const { state: loadingState, startLoading, setSuccess, setError } = useLoadingState({
    timeout: 10000,
    onTimeout: () => console.warn(`[${context}] Loading operation taking longer than expected`)
  });

  // Normalized query key
  const normalizedQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: normalizedQueryKey,
    queryFn,
    staleTime,
    gcTime,
    retry: createRetryConfig(maxRetries, context).retry,
    retryDelay: createRetryConfig(maxRetries, context).retryDelay,
  });

  useEffect(() => {
    if (isLoading) {
      startLoading();
    } else if (isError) {
      setError();
      handleError(error, context);
    } else if (data) {
      setSuccess();
    }
  }, [isLoading, isError, error, data, context, startLoading, setError, setSuccess]);

  const handleRetry = async () => {
    resetRetry();
    startLoading();
    await refetch();
  };

  const handleManualRetry = async () => {
    startLoading();
    const success = await retry(refetch);
    if (!success && attemptCount >= maxRetries) {
      handleError(
        new Error("Maximum retry attempts reached"),
        context
      );
    }
  };

  // Default loading state
  const defaultLoadingFallback = (
    <div className="py-10 flex flex-col items-center justify-center">
      <LoadingSpinner variant="fun" size="lg" text={loadingText} />
    </div>
  );

  // Default error state with retry button
  const defaultErrorFallback = (
    <div className="space-y-4 mx-auto max-w-2xl mt-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Une erreur est survenue lors du chargement des articles.
          {error instanceof Error && ` ${error.message}`}
        </AlertDescription>
      </Alert>
      <div className="flex justify-center space-x-3">
        <Button 
          onClick={handleRetry}
          variant="outline"
          disabled={isRetrying}
          className="mx-auto flex items-center gap-2"
        >
          {isRetrying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          {isRetrying ? `Tentative ${attemptCount}...` : "Réessayer"}
        </Button>
      </div>
    </div>
  );

  // Default empty state
  const defaultEmptyFallback = (
    <div className="py-10 flex flex-col items-center justify-center text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Database className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">Aucun article trouvé</h3>
      <p className="text-gray-500 max-w-md">
        Aucun article ne correspond à votre recherche. Essayez de modifier vos critères.
      </p>
    </div>
  );

  if (loadingState === 'loading' || isLoading) {
    return loadingFallback || defaultLoadingFallback;
  }

  if (loadingState === 'error' || isError) {
    return errorFallback || defaultErrorFallback;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return emptyFallback || defaultEmptyFallback;
  }

  return <>{children(data)}</>;
}

// Skeleton loader for articles
export const ArticlesSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex gap-4">
            <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
