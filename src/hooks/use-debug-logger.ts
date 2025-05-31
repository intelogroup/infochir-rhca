
import { useState, useCallback, useEffect } from 'react';

interface DebugLogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  data?: any;
  stackTrace?: string;
}

interface UseDebugLoggerReturn {
  logs: DebugLogEntry[];
  logInfo: (category: string, message: string, data?: any) => void;
  logWarn: (category: string, message: string, data?: any) => void;
  logError: (category: string, message: string, data?: any, error?: Error) => void;
  logDebug: (category: string, message: string, data?: any) => void;
  clearLogs: () => void;
  exportLogs: () => void;
}

export const useDebugLogger = (maxLogs: number = 100): UseDebugLoggerReturn => {
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);

  const addLog = useCallback((
    level: DebugLogEntry['level'],
    category: string,
    message: string,
    data?: any,
    error?: Error
  ) => {
    const logEntry: DebugLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level,
      category,
      message,
      data,
      stackTrace: error?.stack
    };

    setLogs(prev => [logEntry, ...prev.slice(0, maxLogs - 1)]);

    // Log to console in development
    if (import.meta.env.DEV) {
      const consoleMethod = level === 'error' ? 'error' : 
                           level === 'warn' ? 'warn' : 
                           level === 'debug' ? 'debug' : 'log';
      
      console[consoleMethod](`[${category.toUpperCase()}]`, message, data || '');
      
      if (error && error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
  }, [maxLogs]);

  const logInfo = useCallback((category: string, message: string, data?: any) => {
    addLog('info', category, message, data);
  }, [addLog]);

  const logWarn = useCallback((category: string, message: string, data?: any) => {
    addLog('warn', category, message, data);
  }, [addLog]);

  const logError = useCallback((category: string, message: string, data?: any, error?: Error) => {
    addLog('error', category, message, data, error);
  }, [addLog]);

  const logDebug = useCallback((category: string, message: string, data?: any) => {
    addLog('debug', category, message, data);
  }, [addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const exportLogs = useCallback(() => {
    const logsJson = JSON.stringify(logs, null, 2);
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [logs]);

  // Log initial setup
  useEffect(() => {
    logInfo('system', 'Debug logger initialized', { maxLogs });
  }, [logInfo, maxLogs]);

  return {
    logs,
    logInfo,
    logWarn,
    logError,
    logDebug,
    clearLogs,
    exportLogs
  };
};
