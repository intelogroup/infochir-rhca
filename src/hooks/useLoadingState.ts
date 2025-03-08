
import { useState, useCallback } from 'react';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'partial';

interface UseLoadingStateOptions {
  initialState?: LoadingState;
  timeout?: number;
  onTimeout?: () => void;
}

export function useLoadingState({
  initialState = 'idle',
  timeout = 15000,
  onTimeout
}: UseLoadingStateOptions = {}) {
  const [state, setState] = useState<LoadingState>(initialState);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const startLoading = useCallback(() => {
    setState('loading');
    
    // Set a timeout to detect long-running operations
    if (timeout > 0) {
      const id = setTimeout(() => {
        if (state === 'loading') {
          console.warn(`Loading operation timed out after ${timeout}ms`);
          onTimeout?.();
          setState('partial'); // Use 'partial' to indicate timeout but partial data might be available
        }
      }, timeout);
      
      setTimeoutId(id);
    }
  }, [timeout, onTimeout, state]);
  
  const setSuccess = useCallback(() => {
    setState('success');
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);
  
  const setError = useCallback(() => {
    setState('error');
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);
  
  const setPartial = useCallback(() => {
    setState('partial');
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);
  
  const reset = useCallback(() => {
    setState('idle');
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);
  
  return {
    state,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    isPartial: state === 'partial',
    isIdle: state === 'idle',
    startLoading,
    setSuccess,
    setError,
    setPartial,
    reset
  };
}
