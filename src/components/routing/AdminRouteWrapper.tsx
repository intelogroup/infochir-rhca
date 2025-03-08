
import * as React from "react";
import { Suspense, useEffect, useState, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { motion, AnimatePresence } from "framer-motion";

interface AdminRouteWrapperProps {
  component: React.ComponentType;
  loadingFallback?: React.ReactNode;
}

export const AdminRouteWrapper = ({ 
  component: Component,
  loadingFallback
}: AdminRouteWrapperProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  // Use enhanced scrollToTop hook
  const { isScrolling } = useScrollToTop(location.key || location.pathname, {
    behavior: 'instant',
    debounceTime: 250
  });

  // Optimized animation variants
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        when: "beforeChildren"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3,
        when: "afterChildren"
      }
    }
  };

  // Set loading state with debounce to prevent flicker
  useEffect(() => {
    setIsLoading(true);
    const loadingTimer = window.setTimeout(() => {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }, 300);
    
    return () => {
      window.clearTimeout(loadingTimer);
    };
  }, [location.pathname]);

  // Clean up resources when unmounting
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Custom loading fallback or default spinner
  const renderLoading = () => {
    if (loadingFallback) {
      return loadingFallback;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingSpinner variant="default" size="lg" />
        </motion.div>
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Suspense fallback={renderLoading()}>
          <ErrorBoundary name="admin-route-wrapper" fallback={
            <motion.div 
              className="p-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
              <p className="mb-4">Veuillez réessayer plus tard</p>
              <Button onClick={() => navigate('/admin')}>Retour au tableau de bord</Button>
            </motion.div>
          }>
            {isLoading ? renderLoading() : <Component />}
          </ErrorBoundary>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};
