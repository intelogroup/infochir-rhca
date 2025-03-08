
import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  onRetry?: (attempt: number) => void;
}

export function useRetry({
  maxRetries = 3,
  initialDelay = 1000,
  maxDelay = 30000,
  onRetry
}: UseRetryOptions = {}) {
  const [attemptCount, setAttemptCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const calculateDelay = useCallback((attempt: number) => {
    // Exponential backoff with jitter
    const exponentialDelay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
    const jitter = Math.random() * 500; // Add up to 500ms of random jitter
    return exponentialDelay + jitter;
  }, [initialDelay, maxDelay]);
  
  const retry = useCallback(async (callback: () => Promise<any>) => {
    if (attemptCount >= maxRetries) {
      console.warn(`Maximum retry attempts (${maxRetries}) reached`);
      return false;
    }
    
    const nextAttempt = attemptCount + 1;
    setAttemptCount(nextAttempt);
    
    const delay = calculateDelay(attemptCount);
    console.log(`Retrying (attempt ${nextAttempt}/${maxRetries}) after ${delay}ms delay`);
    
    setIsRetrying(true);
    
    return new Promise<boolean>(resolve => {
      setTimeout(async () => {
        try {
          onRetry?.(nextAttempt);
          await callback();
          setIsRetrying(false);
          resolve(true);
        } catch (error) {
          console.error(`Retry attempt ${nextAttempt} failed:`, error);
          setIsRetrying(false);
          resolve(false);
        }
      }, delay);
    });
  }, [attemptCount, maxRetries, calculateDelay, onRetry]);
  
  const resetRetry = useCallback(() => {
    setAttemptCount(0);
    setIsRetrying(false);
  }, []);
  
  return {
    retry,
    resetRetry,
    attemptCount,
    isRetrying,
    hasRetriesLeft: attemptCount < maxRetries
  };
}
