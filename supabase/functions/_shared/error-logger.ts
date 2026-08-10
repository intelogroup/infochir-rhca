
/**
 * Error logging utilities for edge functions
 */

/**
 * Log an error with a context message and additional details
 * @param context Description of where/when the error occurred
 * @param error The error object
 * @param additionalInfo Optional additional information
 */
export function logError(
  context: string, 
  error: any, 
  additionalInfo?: any
): void {
  console.error(`${context}:`, error);
  
  if (error.stack) {
    console.error(`${context} stack:`, error.stack);
  }
  
  if (additionalInfo) {
    console.error(`${context} additional info:`, additionalInfo);
  }
}

/**
 * Create an error response with proper headers
 * @param message Error message
 * @param status HTTP status code
 * @param headers Additional headers to include
 * @param error Original error object
 * @returns Response object
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  headers: Record<string, string> = {},
  error?: any
): Response {
  // Correlation id so support can match a client report to server logs.
  const correlationId = crypto.randomUUID();

  if (error) {
    // Full detail (message + stack) stays in server logs only.
    logError(`[${correlationId}] ${message || 'Internal server error'}`, error);
  }

  const errorBody: Record<string, unknown> = {
    error: message || 'Internal server error',
    success: false,
    correlationId,
  };

  return new Response(
    JSON.stringify(errorBody),
    { 
      status: status, 
      headers: { 
        'Content-Type': 'application/json',
        ...headers
      }
    }
  );
}


/**
 * Create a success response with proper headers
 * @param data Response data
 * @param status HTTP status code
 * @param headers Additional headers to include
 * @returns Response object
 */
export function createSuccessResponse(
  data: any,
  status: number = 200,
  headers: Record<string, string> = {}
): Response {
  return new Response(
    JSON.stringify(data),
    { 
      status: status, 
      headers: { 
        'Content-Type': 'application/json',
        ...headers
      }
    }
  );
}
