
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layouts/MainLayout";
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { trackView } from '@/lib/analytics/track';
import { DocumentType } from '@/lib/analytics/download/statistics/types';
import { createLogger } from '@/lib/error-logger';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Home, BookOpen, Settings, RefreshCw } from 'lucide-react';
import { ADCHeader } from '@/components/adc/ADCHeader';
import { ADCMission } from '@/components/adc/ADCMission';
import { ADCSubmission } from '@/components/adc/ADCSubmission';
import { ChaptersGrid } from '@/components/atlas/ChaptersGrid';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AtlasTableOfContents } from '@/components/atlas/AtlasTableOfContents';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const logger = createLogger('ADCPage');

const ADC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [tableOfContentsOpen, setTableOfContentsOpen] = useState(false);
  const [isBackfilling, setIsBackfilling] = useState(false);

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await trackView('adc-page', DocumentType.ADC);
        logger.log('Tracked ADC page view');
      } catch (error) {
        logger.error('Failed to track ADC page view:', error);
      }
    };

    trackPageView();
    setPageLoaded(true);
  }, []);

  const handleBackfillAtlas = async () => {
    setIsBackfilling(true);
    try {
      toast.info("Démarrage du processus de remplissage des articles Atlas...");
      
      const { data, error } = await supabase.functions.invoke('backfill-atlas-articles');
      
      if (error) {
        throw error;
      }

      if (data.successful > 0) {
        toast.success(`${data.successful} articles Atlas ajoutés avec succès!`);
        // Invalidate the atlas articles query to refresh the data
        queryClient.invalidateQueries({ queryKey: ['atlas-articles'] });
      }
      
      if (data.failed > 0) {
        toast.warning(`${data.failed} articles ont échoué lors du processus.`);
      }
      
    } catch (error) {
      console.error('Atlas Backfill error:', error);
      toast.error("Erreur lors du remplissage des articles Atlas");
    } finally {
      setIsBackfilling(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F1F0FB] pt-[15px]">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <Home className="h-4 w-4" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Atlas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-2">
              <Dialog open={tableOfContentsOpen} onOpenChange={setTableOfContentsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Table des matières
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Table des matières - Atlas ADC
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <AtlasTableOfContents />
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBackfillAtlas}
                disabled={isBackfilling}
                className="flex items-center gap-2"
              >
                {isBackfilling ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
                {isBackfilling ? 'Mise à jour...' : 'Actualiser Atlas'}
              </Button>
            </div>
          </div>

          <ADCHeader />

          <section id="adc-content" className="mt-12">
            <ErrorBoundary name="AtlasChaptersGrid">
              <ChaptersGrid />
            </ErrorBoundary>
          </section>

          <ADCMission />
          <ADCSubmission />
        </div>
      </div>
    </MainLayout>
  );
};

export default ADC;
