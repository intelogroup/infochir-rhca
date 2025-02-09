
export const getChunkLoadStatus = (chunkName: string) => {
  const entries = performance.getEntriesByType('resource')
    .filter(entry => entry.name.includes(chunkName))
    .map(entry => {
      const resourceTiming = entry as PerformanceResourceTiming;
      return {
        status: resourceTiming.responseEnd > 0 ? 'loaded' : 'failed',
        timing: {
          start: resourceTiming.startTime,
          end: resourceTiming.responseEnd,
          duration: resourceTiming.duration
        },
        size: resourceTiming.decodedBodySize,
        protocol: resourceTiming.nextHopProtocol
      };
    });
  
  return {
    found: entries.length > 0,
    entries,
    dependencies: getDependencyChunks(chunkName)
  };
};

export const getDependencyChunks = (mainChunk: string) => {
  return performance.getEntriesByType('resource')
    .filter(entry => {
      const name = entry.name;
      const timing = entry as PerformanceResourceTiming;
      const mainChunkEntry = performance.getEntriesByType('resource')
        .find(e => e.name.includes(mainChunk));
      return name.includes('.js') && 
             name.includes('vendor') &&
             mainChunkEntry &&
             entry.startTime < mainChunkEntry.startTime;
    })
    .map(entry => {
      const timing = entry as PerformanceResourceTiming;
      return {
        name: entry.name,
        loaded: timing.responseEnd > 0
      };
    });
};

export const getNavigationContext = () => {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  return {
    type: nav?.type || 'unknown',
    redirect: nav?.redirectCount > 0,
    timing: {
      navigationStart: nav?.startTime || 0,
      loadEventEnd: nav?.loadEventEnd || 0,
      domComplete: nav?.domComplete || 0
    }
  };
};

export const getLoadingDiagnostics = () => {
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

  const chunkLoadingDiagnostics = resourceEntries
    .filter(entry => entry.name.includes('About-'))
    .map(entry => ({
      timing: {
        total: entry.duration,
        network: entry.timing.request + entry.timing.response,
        processing: entry.duration - (entry.timing.request + entry.timing.response)
      },
      size: entry.size,
      success: entry.timing.response > 0
    }));

  const sessionDiagnostics = {
    pageLoads: Number(sessionStorage.getItem('pageLoadCount') || 0),
    successfulChunks: Number(sessionStorage.getItem('successfulChunkLoads') || 0),
    failedChunks: Number(sessionStorage.getItem('failedChunkLoads') || 0)
  };

  const loadSequence = resourceEntries
    .map(entry => ({
      name: entry.name,
      startTime: entry.startTime,
      endTime: entry.timing.response > 0 ? entry.startTime + entry.duration : 0
    }))
    .sort((a, b) => a.startTime - b.startTime);

  return {
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
    chunkLoadingDiagnostics,
    sessionDiagnostics,
    loadSequence,
    navigationContext: getNavigationContext(),
    failedChunkDetails: getChunkLoadStatus('About'),
    modules: {
      pending: Array.from(document.querySelectorAll('script[type="module"]')).length,
      loaded: performance.getEntriesByType('resource')
        .filter(e => {
          const timing = e as PerformanceResourceTiming;
          return e.name.endsWith('.js') && timing.responseEnd > 0;
        }).length,
      failed: performance.getEntriesByType('resource')
        .filter(e => {
          const timing = e as PerformanceResourceTiming;
          return e.name.endsWith('.js') && !timing.responseEnd;
        }).length
    },
    performanceMemory: {
      jsHeapSizeLimit: (performance as any).memory?.jsHeapSizeLimit,
      totalJSHeapSize: (performance as any).memory?.totalJSHeapSize,
      usedJSHeapSize: (performance as any).memory?.usedJSHeapSize
    }
  };
};
