
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layouts/MainLayout";
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { trackView } from '@/lib/analytics/track';
import { DocumentType } from '@/lib/analytics/download/statistics/types';
import { createLogger } from '@/lib/error-logger';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Home, BookOpen } from 'lucide-react';
import { ADCHeader } from '@/components/adc/ADCHeader';
import { ADCMission } from '@/components/adc/ADCMission';
import { ADCSubmission } from '@/components/adc/ADCSubmission';
import { ChaptersGrid } from '@/components/atlas/ChaptersGrid';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AtlasTableOfContents } from '@/components/atlas/AtlasTableOfContents';

const logger = createLogger('ADCPage');

const ADC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [tableOfContentsOpen, setTableOfContentsOpen] = useState(false);

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
