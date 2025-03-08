
import { useQuery } from "@tanstack/react-query";
import { mockArticles } from "../data/mockArticles";
import { createLogger } from "@/lib/error-logger";
import { handleBoundaryError } from "@/lib/monitoring/error-tracking";
import { createRetryConfig } from "@/utils/errorHandling";

const logger = createLogger('useArticlesQuery');

/**
 * Hook to fetch articles with improved error handling and retry logic
 */
export const useArticlesQuery = (page = 0, pageSize = 10) => {
  // Calculate pagination values
  const start = page * pageSize;
  const end = start + pageSize;
  
  return useQuery({
    queryKey: ['articles', page, pageSize],
    queryFn: async () => {
      try {
        // Simulate a network request with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        // In a real application, this would be an API call
        // For now, we're simulating with a timeout and mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        // Simulate pagination
        const articles = mockArticles.slice(start, end);
        const totalPages = Math.ceil(mockArticles.length / pageSize);
        
        return { 
          articles, 
          totalCount: mockArticles.length,
          totalPages,
          currentPage: page
        };
      } catch (error) {
        // Log the error
        logger.error('Error fetching articles', { error, page });
        
        // Track the error in monitoring
        handleBoundaryError(
          error instanceof Error ? error : new Error('Unknown error fetching articles'),
          { componentStack: 'useArticlesQuery' },
          'useArticlesQuery'
        );
        
        // Rethrow for React Query to handle
        throw error;
      }
    },
    // Use the retry configuration from errorHandling.ts
    ...createRetryConfig(3, 'useArticlesQuery')
  });
};
