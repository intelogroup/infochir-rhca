
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    console.log("[ErrorBoundary] Initializing");
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error("[ErrorBoundary] getDerivedStateFromError:", {
      error,
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Error caught:", {
      error,
      message: error.message,
      stack: error.stack,
      name: error.name,
      componentStack: errorInfo.componentStack,
      errorInfo
    });

    // Enhanced chunk loading error diagnostics
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resourceEntries = performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('.js'))
        .map(entry => {
          const resourceTiming = entry as PerformanceResourceTiming;
          return {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            size: resourceTiming.decodedBodySize,
            protocol: resourceTiming.nextHopProtocol,
            timing: {
              dns: resourceTiming.domainLookupEnd - resourceTiming.domainLookupStart,
              tcp: resourceTiming.connectEnd - resourceTiming.connectStart,
              request: resourceTiming.responseStart - resourceTiming.requestStart,
              response: resourceTiming.responseEnd - resourceTiming.responseStart
            }
          };
        });

      console.error("[ErrorBoundary] Chunk loading diagnostic:", {
        timestamp: new Date().toISOString(),
        location: {
          currentPath: window.location.pathname,
          previousPath: document.referrer,
          hash: window.location.hash,
          search: window.location.search
        },
        network: {
          online: navigator.onLine,
          type: (navigator as any).connection?.type,
          effectiveType: (navigator as any).connection?.effectiveType,
          downlink: (navigator as any).connection?.downlink
        },
        navigation: {
          type: navigationEntry?.type,
          redirectCount: navigationEntry?.redirectCount,
          timing: {
            fetchStart: navigationEntry?.fetchStart,
            domainLookupStart: navigationEntry?.domainLookupStart,
            domainLookupEnd: navigationEntry?.domainLookupEnd,
            connectStart: navigationEntry?.connectStart,
            connectEnd: navigationEntry?.connectEnd,
            requestStart: navigationEntry?.requestStart,
            responseStart: navigationEntry?.responseStart,
            responseEnd: navigationEntry?.responseEnd,
            domComplete: navigationEntry?.domComplete
          }
        },
        router: {
          historyState: window.history.state,
          historyLength: window.history.length,
          transition: {
            startTime: performance.now(),
            lastSuccessfulRoute: sessionStorage.getItem('lastSuccessfulRoute'),
            transitionCount: sessionStorage.getItem('routeTransitionCount')
          }
        },
        resources: resourceEntries,
        modules: {
          pending: Array.from(document.querySelectorAll('script[type="module"]')).length,
          loaded: performance.getEntriesByType('resource')
            .filter(e => e.name.endsWith('.js') && e.responseEnd > 0).length,
          failed: performance.getEntriesByType('resource')
            .filter(e => e.name.endsWith('.js') && !e.responseEnd).length
        },
        performanceMemory: {
          jsHeapSizeLimit: (performance as any).memory?.jsHeapSizeLimit,
          totalJSHeapSize: (performance as any).memory?.totalJSHeapSize,
          usedJSHeapSize: (performance as any).memory?.usedJSHeapSize
        }
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message.includes('Failed to fetch dynamically imported module');
      
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {isChunkError ? "Erreur de chargement" : "Une erreur est survenue"}
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>
                {isChunkError 
                  ? "Le chargement de la page a échoué. Veuillez réessayer."
                  : this.state.error?.message || "Une erreur inattendue s'est produite."
                }
              </p>
              {this.state.error?.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">Détails techniques</summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-48 bg-gray-100 p-2 rounded">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </AlertDescription>
            <Button
              variant="outline"
              className="mt-4"
              onClick={this.handleRetry}
            >
              Réessayer
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

