
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { RHCAHeader } from "@/components/rhca/components/RHCAHeader";
import { RhcaContent } from "@/components/rhca/RhcaContent";
import { RHCAAdminPanel } from "@/components/rhca/admin/RHCAAdminPanel";
import { useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { createLogger } from '@/lib/error-logger';

const logger = createLogger('RHCAPage');

const RHCA: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const isDebug = searchParams.get('debug') === 'true';
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
    logger.info("RHCA page mounted");
    
    return () => {
      logger.info("RHCA page unmounted");
    };
  }, []);

  return (
    <MainLayout>
      <div className="bg-gray-50/50 pt-[50px]">
        <RHCAHeader />
        
        <div className="container mx-auto px-4 py-8 md:py-12 mb-20 sm:mb-16 md:mb-0">
          {/* Admin panel section */}
          {isAdmin && (
            <ErrorBoundary name="rhca-admin-panel">
              <RHCAAdminPanel isAdmin={isAdmin} isDebug={isDebug} />
            </ErrorBoundary>
          )}
          
          {/* Main content section */}
          <ErrorBoundary 
            name="rhca-content"
            fallback={
              <div className="text-center py-16 space-y-4">
                <div className="mx-auto h-12 w-12 text-yellow-500 flex items-center justify-center bg-yellow-100 rounded-full">
                  <span className="text-xl">!</span>
                </div>
                <h3 className="text-xl font-semibold">Erreur de chargement</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Une erreur est survenue lors du chargement des articles. Veuillez réessayer ultérieurement.
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            }
          >
            <RhcaContent />
          </ErrorBoundary>
        </div>
      </div>
    </MainLayout>
  );
};

export default RHCA;
