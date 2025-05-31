
import React from 'react';
import { motion } from 'framer-motion';

interface PullToRefreshIndicatorProps {
  isVisible: boolean;
  isReady: boolean;
  isRefreshing: boolean;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  isVisible,
  isReady,
  isRefreshing
}) => {
  return (
    <div 
      data-pull-indicator
      className={`
        fixed top-0 left-1/2 transform -translate-x-1/2 z-50
        bg-primary text-white px-4 py-2 rounded-b-lg shadow-lg
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
      `}
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          className="text-lg"
        >
          {isRefreshing ? '🔄' : isReady ? '↑' : '↓'}
        </motion.div>
        <span className="text-sm font-medium">
          {isRefreshing 
            ? 'Mise à jour...' 
            : isReady 
              ? 'Relâchez pour actualiser' 
              : 'Tirez pour actualiser'
          }
        </span>
      </div>
    </div>
  );
};
