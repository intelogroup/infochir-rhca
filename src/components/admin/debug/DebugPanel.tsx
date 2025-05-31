
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bug, 
  Database, 
  Network, 
  User, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Terminal,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";

interface DebugLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: 'auth' | 'database' | 'network' | 'ui' | 'system';
  message: string;
  data?: any;
}

export const DebugPanel: React.FC = () => {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [systemInfo, setSystemInfo] = useState<any>({});
  const [isDebugging, setIsDebugging] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      collectSystemInfo();
      addDebugLog('info', 'system', 'Debug panel initialized', { userId: user?.id });
    }
  }, [isAdmin, user]);

  const addDebugLog = (level: DebugLog['level'], category: DebugLog['category'], message: string, data?: any) => {
    const log: DebugLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level,
      category,
      message,
      data
    };
    
    setDebugLogs(prev => [log, ...prev.slice(0, 99)]); // Keep last 100 logs
    
    // Also log to console for development
    if (import.meta.env.DEV) {
      console.log(`[DEBUG:${category.toUpperCase()}:${level.toUpperCase()}]`, message, data);
    }
  };

  const collectSystemInfo = () => {
    const info = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      localStorage: {
        available: typeof Storage !== 'undefined',
        itemCount: localStorage.length
      },
      sessionStorage: {
        available: typeof Storage !== 'undefined',
        itemCount: sessionStorage.length
      },
      performance: {
        navigation: performance.navigation?.type,
        timing: performance.timing ? {
          loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
        } : null
      }
    };
    
    setSystemInfo(info);
    addDebugLog('info', 'system', 'System information collected', info);
  };

  const testDatabaseConnection = async () => {
    try {
      addDebugLog('info', 'database', 'Testing database connection...');
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('count')
        .limit(1);
      
      if (error) {
        addDebugLog('error', 'database', 'Database connection failed', error);
        toast.error('Database connection failed');
      } else {
        addDebugLog('info', 'database', 'Database connection successful', { result: data });
        toast.success('Database connection successful');
      }
    } catch (err) {
      addDebugLog('error', 'database', 'Database test exception', err);
      toast.error('Database test failed with exception');
    }
  };

  const testAuthStatus = async () => {
    try {
      addDebugLog('info', 'auth', 'Testing authentication status...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        addDebugLog('error', 'auth', 'Auth session check failed', error);
      } else {
        addDebugLog('info', 'auth', 'Auth session check completed', {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email
        });
      }
    } catch (err) {
      addDebugLog('error', 'auth', 'Auth test exception', err);
    }
  };

  const clearLogs = () => {
    setDebugLogs([]);
    addDebugLog('info', 'system', 'Debug logs cleared');
    toast.success('Debug logs cleared');
  };

  const exportLogs = () => {
    const logsJson = JSON.stringify(debugLogs, null, 2);
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    addDebugLog('info', 'system', 'Debug logs exported');
    toast.success('Debug logs exported');
  };

  const getLevelIcon = (level: DebugLog['level']) => {
    switch (level) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'debug': return <Bug className="h-4 w-4 text-gray-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getCategoryIcon = (category: DebugLog['category']) => {
    switch (category) {
      case 'auth': return <Shield className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'network': return <Network className="h-4 w-4" />;
      case 'ui': return <Terminal className="h-4 w-4" />;
      case 'system': return <Bug className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 animate-spin" />
            <span>Loading debug panel...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <Shield className="h-4 w-4" />
            <span>Access Denied: Admin privileges required</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Admin Debug Panel
          </CardTitle>
          <CardDescription>
            System debugging and monitoring tools for administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={testDatabaseConnection} variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Test Database
            </Button>
            <Button onClick={testAuthStatus} variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Test Auth
            </Button>
            <Button onClick={collectSystemInfo} variant="outline" size="sm">
              <Terminal className="h-4 w-4 mr-2" />
              Refresh System Info
            </Button>
            <Button onClick={exportLogs} variant="outline" size="sm">
              Export Logs
            </Button>
            <Button onClick={clearLogs} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList>
          <TabsTrigger value="logs">Debug Logs</TabsTrigger>
          <TabsTrigger value="system">System Info</TabsTrigger>
          <TabsTrigger value="auth">Auth Status</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Debug Logs ({debugLogs.length})</CardTitle>
              <CardDescription>Real-time system and application logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {debugLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      {getLevelIcon(log.level)}
                      {getCategoryIcon(log.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {log.category}
                        </Badge>
                        <Badge variant={log.level === 'error' ? 'destructive' : 'secondary'} className="text-xs">
                          {log.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{log.message}</p>
                      {log.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer">
                            Show details
                          </summary>
                          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
                {debugLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No debug logs yet. Interact with the system to generate logs.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Current system and browser details</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                {JSON.stringify(systemInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Current user and authentication state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">User ID</label>
                    <p className="text-sm text-muted-foreground">{user?.id || 'Not available'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{user?.email || 'Not available'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Admin Status</label>
                    <Badge variant={isAdmin ? 'default' : 'secondary'}>
                      {isAdmin ? 'Admin' : 'Not Admin'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Loading State</label>
                    <Badge variant={isLoading ? 'secondary' : 'default'}>
                      {isLoading ? 'Loading' : 'Loaded'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
