
import React, { ReactNode } from 'react';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { PullToRefreshIndicator } from './PullToRefreshIndicator';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedContainerProps {
  children: ReactNode;
  onRefresh?: () => Promise<void> | void;
  className?: string;
  disablePullToRefresh?: boolean;
}

export const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({
  children,
  onRefresh,
  className = '',
  disablePullToRefresh = false
}) => {
  const isMobile = useIsMobile();
  
  const { containerRef, isRefreshing } = usePullToRefresh({
    onRefresh: onRefresh || (() => {}),
    disabled: disablePullToRefresh || !onRefresh || !isMobile
  });

  return (
    <>
      {isMobile && onRefresh && !disablePullToRefresh && (
        <PullToRefreshIndicator
          isVisible={false}
          isReady={false}
          isRefreshing={isRefreshing}
        />
      )}
      <div
        ref={containerRef}
        className={`${className} ${isMobile ? 'touch-manipulation overscroll-y-contain' : ''}`}
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        {children}
      </div>
    </>
  );
};
