
import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  maxPullDistance?: number;
  disabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPullDistance = 150,
  disabled = false
}: UsePullToRefreshOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isPulling = useRef<boolean>(false);
  const isRefreshing = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing.current) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Only allow pull to refresh when at the top of the page
    if (container.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
    isPulling.current = false;
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing.current) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    currentY.current = e.touches[0].clientY;
    const pullDistance = currentY.current - startY.current;
    
    if (pullDistance > 0) {
      isPulling.current = true;
      
      // Prevent default scrolling when pulling down
      e.preventDefault();
      
      // Calculate the visual feedback based on pull distance
      const normalizedDistance = Math.min(pullDistance, maxPullDistance);
      const opacity = Math.min(normalizedDistance / threshold, 1);
      
      // Apply visual feedback
      container.style.transform = `translateY(${normalizedDistance * 0.5}px)`;
      container.style.transition = 'none';
      
      // Update pull indicator if it exists
      const indicator = container.querySelector('[data-pull-indicator]') as HTMLElement;
      if (indicator) {
        indicator.style.opacity = opacity.toString();
        indicator.style.transform = `translateY(${normalizedDistance}px) rotate(${normalizedDistance * 2}deg)`;
        
        if (pullDistance >= threshold) {
          indicator.setAttribute('data-ready', 'true');
        } else {
          indicator.removeAttribute('data-ready');
        }
      }
    }
  }, [disabled, threshold, maxPullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing.current) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const pullDistance = currentY.current - startY.current;
    
    // Reset transform with animation
    container.style.transition = 'transform 0.3s ease-out';
    container.style.transform = 'translateY(0)';
    
    const indicator = container.querySelector('[data-pull-indicator]') as HTMLElement;
    if (indicator) {
      indicator.style.transition = 'all 0.3s ease-out';
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateY(0) rotate(0deg)';
      indicator.removeAttribute('data-ready');
    }
    
    if (isPulling.current && pullDistance >= threshold) {
      isRefreshing.current = true;
      
      try {
        // Show loading indicator
        if (indicator) {
          indicator.style.opacity = '1';
          indicator.innerHTML = '🔄';
          indicator.style.animation = 'spin 1s linear infinite';
        }
        
        await onRefresh();
        
        toast.success('Contenu mis à jour', {
          description: 'Les dernières données ont été chargées'
        });
      } catch (error) {
        console.error('Refresh failed:', error);
        toast.error('Erreur lors de la mise à jour', {
          description: 'Veuillez réessayer'
        });
      } finally {
        isRefreshing.current = false;
        
        // Hide indicator after a short delay
        setTimeout(() => {
          if (indicator) {
            indicator.style.opacity = '0';
            indicator.style.animation = '';
            indicator.innerHTML = '↓';
          }
        }, 500);
      }
    }
    
    isPulling.current = false;
    startY.current = 0;
    currentY.current = 0;
  }, [disabled, threshold, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { containerRef, isRefreshing: isRefreshing.current };
};
