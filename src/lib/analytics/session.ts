/**
 * Session Manager for Analytics
 * Provides consistent session ID and client info across all tracking functions
 */

const SESSION_STORAGE_KEY = 'analytics_session_id';
const SESSION_START_KEY = 'analytics_session_start';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

let cachedSessionId: string | null = null;

/**
 * Generate a unique session ID
 */
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

/**
 * Check if the current session has expired
 */
const isSessionExpired = (): boolean => {
  const sessionStart = localStorage.getItem(SESSION_START_KEY);
  if (!sessionStart) return true;
  
  const elapsed = Date.now() - parseInt(sessionStart, 10);
  return elapsed > SESSION_TIMEOUT_MS;
};

/**
 * Get or create a session ID
 * Creates a new session if:
 * - No session exists
 * - Session has expired (30 minutes of inactivity)
 */
export const getSessionId = (): string => {
  // Return cached value if available and not expired
  if (cachedSessionId && !isSessionExpired()) {
    // Update session start time on activity
    localStorage.setItem(SESSION_START_KEY, Date.now().toString());
    return cachedSessionId;
  }

  // Check localStorage for existing session
  const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  
  if (storedSessionId && !isSessionExpired()) {
    cachedSessionId = storedSessionId;
    // Update session start time on activity
    localStorage.setItem(SESSION_START_KEY, Date.now().toString());
    return cachedSessionId;
  }

  // Create new session
  cachedSessionId = generateSessionId();
  localStorage.setItem(SESSION_STORAGE_KEY, cachedSessionId);
  localStorage.setItem(SESSION_START_KEY, Date.now().toString());
  
  return cachedSessionId;
};

/**
 * Get client information for tracking
 */
export const getClientInfo = () => ({
  sessionId: getSessionId(),
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  referrer: typeof document !== 'undefined' ? document.referrer : null,
  pageUrl: typeof window !== 'undefined' ? window.location.href : null,
  screenSize: typeof window !== 'undefined' 
    ? `${window.innerWidth}x${window.innerHeight}` 
    : null,
});

/**
 * Clear the current session (useful for logout)
 */
export const clearSession = (): void => {
  cachedSessionId = null;
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(SESSION_START_KEY);
};
