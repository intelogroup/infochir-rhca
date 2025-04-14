
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layouts/MainLayout";
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { trackView } from '@/lib/analytics/track';
import { DocumentType } from '@/lib/analytics/download/statistics/types';
import { createLogger } from '@/lib/error-logger';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { ADCHeader } from '@/components/adc/ADCHeader';
import { ADCMission } from '@/components/adc/ADCMission';
import { ADCSubmission } from '@/components/adc/ADCSubmission';
import { ChaptersGrid } from '@/components/atlas/ChaptersGrid';

const logger = createLogger('ADCPage');

const ADC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [pageLoaded, setPageLoaded] = useState(false);

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
