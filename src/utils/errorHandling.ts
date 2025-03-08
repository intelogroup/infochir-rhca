
import { toast } from "sonner";

type ErrorResponse = {
  type: string;
  message: string;
  details?: string;
  status?: number;
};

export function parseError(error: unknown): ErrorResponse {
  // Default error response
  let errorResponse: ErrorResponse = {
    type: 'unknown_error',
    message: 'Une erreur inattendue est survenue'
  };

  if (error instanceof Error) {
    errorResponse.message = error.message;
    
    // Network errors
    if (
      error.message.includes('NetworkError') || 
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')
    ) {
      errorResponse.type = 'network_error';
      errorResponse.message = 'Problème de connexion au serveur';
      errorResponse.details = 'Vérifiez votre connexion internet et réessayez';
    }
    
    // Timeout errors
    else if (
      error.message.includes('timeout') || 
      error.message.includes('Timed out')
    ) {
      errorResponse.type = 'timeout_error';
      errorResponse.message = 'La requête a pris trop de temps';
      errorResponse.details = 'Le serveur met trop de temps à répondre';
    }
    
    // CORS errors
    else if (error.message.includes('CORS')) {
      errorResponse.type = 'cors_error';
      errorResponse.message = 'Problème d\'accès au serveur';
    }
    
    // Aborted requests
    else if (
      error.message.includes('aborted') || 
      error.message.includes('AbortError')
    ) {
      errorResponse.type = 'aborted_request';
      errorResponse.message = 'Requête annulée';
      errorResponse.details = 'L\'opération a été interrompue';
    }
  }
  
  // Check if it's a Supabase error
  if (
    typeof error === 'object' && 
    error !== null && 
    'code' in error && 
    'message' in error
  ) {
    const supabaseError = error as { code: string; message: string; details?: string; hint?: string; };
    
    errorResponse.type = 'supabase_error';
    errorResponse.message = supabaseError.message;
    errorResponse.details = supabaseError.details || supabaseError.hint;
    
    if (supabaseError.code === 'PGRST116') {
      errorResponse.type = 'not_found';
      errorResponse.message = 'Ressource non trouvée';
    } else if (supabaseError.code === '42501') {
      errorResponse.type = 'permission_error';
      errorResponse.message = 'Vous n\'avez pas les permissions nécessaires';
    }
  }
  
  return errorResponse;
}

export function handleError(error: unknown, context: string = ''): ErrorResponse {
  const errorInfo = parseError(error);
  
  // Log the error with context for debugging
  console.error(`[${context}] Error:`, error);
  
  // Show a toast notification for user feedback (if appropriate)
  if (errorInfo.type !== 'aborted_request') {
    toast.error(errorInfo.message, {
      description: errorInfo.details,
      // Don't auto-dismiss serious errors
      duration: ['network_error', 'supabase_error'].includes(errorInfo.type) 
        ? 10000 // 10 seconds
        : 5000,  // 5 seconds
    });
  }
  
  return errorInfo;
}

// Create a utility for retry logic
export function createRetryConfig(maxRetries = 3, context = '') {
  return {
    retry: (failureCount: number, error: unknown) => {
      const errorInfo = parseError(error);
      
      // Don't retry if it's not a network-related issue
      if (!['network_error', 'timeout_error'].includes(errorInfo.type)) {
        console.log(`[${context}] Not retrying, error type:`, errorInfo.type);
        return false;
      }
      
      // Log retry attempts
      console.log(`[${context}] Retry attempt ${failureCount}/${maxRetries} for:`, errorInfo.message);
      
      return failureCount < maxRetries;
    },
    retryDelay: (attempt: number) => {
      // Exponential backoff with jitter
      const delay = Math.min(1000 * 2 ** attempt, 30000);
      const jitter = Math.random() * 1000;
      return delay + jitter;
    }
  };
}

// Helper for fallback data in case of errors
export function getFallbackData<T>(defaultData: T, error: unknown, context: string): T {
  handleError(error, context);
  return defaultData;
}
