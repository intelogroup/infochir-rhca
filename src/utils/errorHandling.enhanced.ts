
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('ErrorHandling');

// More detailed error response type
export interface EnhancedErrorResponse {
  type: string;
  code?: string;
  message: string;
  details?: string;
  status?: number;
  recoverable: boolean;
  retryable: boolean;
  userActionNeeded: boolean;
  suggestedAction?: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  timestamp: string;
  context?: string;
}

/**
 * Enhanced error parsing with more granular error classification
 */
export function parseErrorEnhanced(
  error: unknown, 
  context?: string
): EnhancedErrorResponse {
  // Default error response with current timestamp
  const timestamp = new Date().toISOString();
  
  let errorResponse: EnhancedErrorResponse = {
    type: 'unknown_error',
    message: 'Une erreur inattendue est survenue',
    recoverable: true,
    retryable: true,
    userActionNeeded: false,
    severity: 'error',
    timestamp,
    context
  };

  // For standard Error objects
  if (error instanceof Error) {
    errorResponse.message = error.message;
    
    // Extract error code if available in name (e.g., AuthError, FetchError)
    if (error.name && error.name !== 'Error') {
      errorResponse.code = error.name;
    }
    
    // Network errors
    if (
      error.message.includes('NetworkError') || 
      error.message.includes('network') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('fetch failed')
    ) {
      errorResponse.type = 'network_error';
      errorResponse.message = 'Problème de connexion au serveur';
      errorResponse.details = 'Vérifiez votre connexion internet et réessayez';
      errorResponse.retryable = true;
      errorResponse.userActionNeeded = true;
      errorResponse.suggestedAction = 'Vérifiez votre connexion internet';
    }
    
    // Timeout errors
    else if (
      error.message.includes('timeout') || 
      error.message.includes('Timed out') ||
      error.message.includes('Request timed out')
    ) {
      errorResponse.type = 'timeout_error';
      errorResponse.message = 'La requête a pris trop de temps';
      errorResponse.details = 'Le serveur met trop de temps à répondre';
      errorResponse.retryable = true;
      errorResponse.severity = 'warning';
    }
    
    // CORS errors
    else if (error.message.includes('CORS')) {
      errorResponse.type = 'cors_error';
      errorResponse.message = 'Problème d\'accès au serveur';
      errorResponse.details = 'La requête a été bloquée par votre navigateur pour des raisons de sécurité';
      errorResponse.retryable = false;
      errorResponse.severity = 'error';
      errorResponse.userActionNeeded = true;
      errorResponse.suggestedAction = 'Contactez l\'administrateur du site';
    }
    
    // Aborted requests
    else if (
      error.message.includes('aborted') || 
      error.message.includes('AbortError')
    ) {
      errorResponse.type = 'aborted_request';
      errorResponse.message = 'Requête annulée';
      errorResponse.details = 'L\'opération a été interrompue';
      errorResponse.retryable = true;
      errorResponse.severity = 'info';
    }
    
    // Authentication errors
    else if (
      error.message.includes('auth') ||
      error.message.includes('authentication') ||
      error.message.includes('token') ||
      error.message.includes('credential') ||
      error.message.includes('permission') ||
      error.message.includes('unauthorized') ||
      error.message.includes('Unauthorized') ||
      error.message.includes('403')
    ) {
      errorResponse.type = 'auth_error';
      errorResponse.message = 'Problème d\'authentification';
      errorResponse.details = 'Veuillez vous reconnecter';
      errorResponse.retryable = false;
      errorResponse.userActionNeeded = true;
      errorResponse.suggestedAction = 'Reconnectez-vous';
      errorResponse.severity = 'error';
    }
    
    // Not found errors
    else if (
      error.message.includes('not found') ||
      error.message.includes('404') ||
      error.message.includes('Not Found')
    ) {
      errorResponse.type = 'not_found_error';
      errorResponse.message = 'Ressource non trouvée';
      errorResponse.details = 'La ressource demandée n\'existe pas ou a été déplacée';
      errorResponse.retryable = false;
      errorResponse.severity = 'warning';
    }
    
    // Storage/Quota errors
    else if (
      error.message.includes('storage') ||
      error.message.includes('quota') ||
      error.message.includes('disk') ||
      error.message.includes('space')
    ) {
      errorResponse.type = 'storage_error';
      errorResponse.message = 'Problème de stockage';
      errorResponse.details = 'Espace de stockage insuffisant';
      errorResponse.retryable = false;
      errorResponse.userActionNeeded = true;
      errorResponse.suggestedAction = 'Libérez de l\'espace';
      errorResponse.severity = 'warning';
    }
    
    // Format/Validation errors
    else if (
      error.message.includes('format') ||
      error.message.includes('validation') ||
      error.message.includes('invalid') ||
      error.message.includes('schema')
    ) {
      errorResponse.type = 'validation_error';
      errorResponse.message = 'Données non valides';
      errorResponse.details = 'Les données fournies ne sont pas dans un format valide';
      errorResponse.retryable = false;
      errorResponse.userActionNeeded = true;
      errorResponse.suggestedAction = 'Vérifiez les données saisies';
      errorResponse.severity = 'warning';
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
    errorResponse.code = supabaseError.code;
    
    // Handle specific Supabase error codes
    switch (supabaseError.code) {
      case 'PGRST116':
        errorResponse.type = 'not_found';
        errorResponse.message = 'Ressource non trouvée';
        errorResponse.retryable = false;
        errorResponse.severity = 'warning';
        break;
      case '42501':
        errorResponse.type = 'permission_error';
        errorResponse.message = 'Vous n\'avez pas les permissions nécessaires';
        errorResponse.retryable = false;
        errorResponse.userActionNeeded = true;
        errorResponse.severity = 'error';
        break;
      case '23505':
        errorResponse.type = 'duplicate_error';
        errorResponse.message = 'Cette ressource existe déjà';
        errorResponse.retryable = false;
        errorResponse.userActionNeeded = true;
        errorResponse.severity = 'warning';
        break;
      case '23503':
        errorResponse.type = 'reference_error';
        errorResponse.message = 'Impossible de supprimer cette ressource';
        errorResponse.details = 'Des références à cette ressource existent encore';
        errorResponse.retryable = false;
        errorResponse.userActionNeeded = true;
        errorResponse.severity = 'warning';
        break;
      case 'P0001':
        errorResponse.type = 'database_error';
        errorResponse.message = 'Erreur dans la base de données';
        errorResponse.retryable = false;
        errorResponse.severity = 'error';
        break;
    }
  }
  
  // Extract HTTP status if available
  if (
    typeof error === 'object' && 
    error !== null && 
    'status' in error
  ) {
    const statusError = error as { status: number };
    errorResponse.status = statusError.status;
    
    // Set severity based on status code
    if (errorResponse.status >= 500) {
      errorResponse.severity = 'critical';
      errorResponse.retryable = true;
    } else if (errorResponse.status >= 400) {
      errorResponse.severity = 'error';
      errorResponse.retryable = errorResponse.status === 429 || errorResponse.status === 408;
    }
  }
  
  // For fetch-specific errors
  if (
    typeof error === 'object' && 
    error !== null && 
    'type' in error && 
    typeof error.type === 'string'
  ) {
    const fetchError = error as { type: string };
    
    if (fetchError.type === 'cors') {
      errorResponse.type = 'cors_error';
      errorResponse.message = 'Problème d\'accès au serveur';
      errorResponse.details = 'La requête a été bloquée par votre navigateur pour des raisons de sécurité';
      errorResponse.retryable = false;
      errorResponse.severity = 'error';
    }
  }
  
  return errorResponse;
}

/**
 * Enhanced error handler with more detailed logging and contextual toasts
 */
export function handleErrorEnhanced(
  error: unknown, 
  context: string = '',
  options: {
    silent?: boolean;
    retryCallback?: () => void;
    toastDuration?: number;
    logLevel?: 'error' | 'warn' | 'info';
  } = {}
): EnhancedErrorResponse {
  const errorInfo = parseErrorEnhanced(error, context);
  const { silent = false, toastDuration, logLevel = 'error', retryCallback } = options;
  
  // Log the error with context for debugging
  if (logLevel === 'error') {
    logger.error(`[${context}] ${errorInfo.type}:`, {
      error,
      details: errorInfo
    });
  } else if (logLevel === 'warn') {
    logger.warn(`[${context}] ${errorInfo.type}:`, {
      error,
      details: errorInfo
    });
  } else {
    logger.info(`[${context}] ${errorInfo.type}:`, {
      error,
      details: errorInfo
    });
  }
  
  // Show a toast notification for user feedback (if appropriate)
  if (!silent && errorInfo.type !== 'aborted_request') {
    toast.error(errorInfo.message, {
      description: errorInfo.details,
      duration: toastDuration || (errorInfo.severity === 'critical' ? 10000 : 5000),
      action: retryCallback && errorInfo.retryable ? {
        label: 'Réessayer',
        onClick: retryCallback
      } : undefined
    });
  }
  
  return errorInfo;
}

/**
 * Create a retry configuration for React Query with enhanced error handling
 */
export function createEnhancedRetryConfig(options = {
  maxRetries: 3, 
  context: '',
  retryNetworkErrors: true,
  retryTimeoutErrors: true,
  retryServerErrors: true,
  retrySpecificErrors: [] as string[],
  baseDelay: 1000,
  maxDelay: 30000,
  exponential: true,
  addJitter: true
}) {
  return {
    retry: (failureCount: number, error: unknown) => {
      const errorInfo = parseErrorEnhanced(error, options.context);
      
      // Don't retry past max retries
      if (failureCount >= options.maxRetries) {
        logger.warn(`[${options.context}] Max retries (${options.maxRetries}) reached, giving up`);
        return false;
      }
      
      // Check if error should be retried based on configuration
      let shouldRetry = false;
      
      // Retry network errors if configured
      if (options.retryNetworkErrors && 
          (errorInfo.type === 'network_error' || errorInfo.type === 'cors_error')) {
        shouldRetry = true;
      }
      
      // Retry timeout errors if configured
      if (options.retryTimeoutErrors && errorInfo.type === 'timeout_error') {
        shouldRetry = true;
      }
      
      // Retry server errors (5xx) if configured
      if (options.retryServerErrors && 
          errorInfo.status && errorInfo.status >= 500 && errorInfo.status < 600) {
        shouldRetry = true;
      }
      
      // Retry specific error types if configured
      if (options.retrySpecificErrors.includes(errorInfo.type)) {
        shouldRetry = true;
      }
      
      // Don't retry if the error is explicitly marked as not retryable
      if (!errorInfo.retryable) {
        logger.info(`[${options.context}] Error marked as not retryable: ${errorInfo.type}`);
        shouldRetry = false;
      }
      
      logger.log(`[${options.context}] Retry decision for ${errorInfo.type}: ${shouldRetry ? 'Yes' : 'No'} (attempt ${failureCount+1}/${options.maxRetries})`);
      
      return shouldRetry;
    },
    retryDelay: (attempt: number) => {
      // Calculate delay
      let delay: number;
      
      if (options.exponential) {
        // Exponential backoff: 2^n * baseDelay (1s, 2s, 4s, 8s, etc.)
        delay = options.baseDelay * Math.pow(2, attempt);
      } else {
        // Linear backoff: n * baseDelay (1s, 2s, 3s, 4s, etc.)
        delay = options.baseDelay * (attempt + 1);
      }
      
      // Cap the maximum delay
      delay = Math.min(delay, options.maxDelay);
      
      // Add jitter to prevent thundering herd problem
      if (options.addJitter) {
        const jitter = Math.random() * options.baseDelay;
        delay = delay + jitter;
      }
      
      logger.log(`[${options.context}] Retry delay: ${Math.round(delay)}ms (attempt ${attempt+1})`);
      
      return delay;
    }
  };
}

/**
 * Helper for fallback data in case of errors with enhanced logging
 */
export function getEnhancedFallbackData<T>(
  defaultData: T, 
  error: unknown, 
  context: string,
  options?: {
    silent?: boolean;
    logLevel?: 'error' | 'warn' | 'info';
  }
): T {
  handleErrorEnhanced(error, context, {
    silent: options?.silent,
    logLevel: options?.logLevel
  });
  
  logger.info(`[${context}] Returning fallback data due to error`);
  return defaultData;
}
