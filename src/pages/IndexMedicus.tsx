
import { useEffect, useState } from 'react';
import { ArticleGridWrapper } from '@/components/index-medicus/ArticleGridWrapper';
import { IndexMedicusHeader } from '@/components/index-medicus/IndexMedicusHeader';
import { GenericErrorBoundary } from '@/components/error-boundary/GenericErrorBoundary';
import MainLayout from '@/components/layouts/MainLayout';
import { setupGlobalErrorHandlers } from '@/lib/monitoring/error-tracking';

const IndexMedicus = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set up global error handlers once
    setupGlobalErrorHandlers();
    
    // Mark component as loaded after a short delay
    // This helps with any potential hydration issues
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <MainLayout>
      <GenericErrorBoundary errorContext="IndexMedicus" showHome={true}>
        <div className="container max-w-7xl mx-auto py-8 px-4">
          <IndexMedicusHeader />
          
          {/* Render the article grid only after initial load to prevent hydration issues */}
          {isLoaded && (
            <div className="mt-8">
              <ArticleGridWrapper defaultViewMode="table" />
            </div>
          )}
        </div>
      </GenericErrorBoundary>
    </MainLayout>
  );
};

export default IndexMedicus;
