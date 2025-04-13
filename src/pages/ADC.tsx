
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layouts/MainLayout";
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { createLogger } from '@/lib/error-logger';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';
import { trackView } from '@/lib/analytics/track';
import { DocumentType } from '@/lib/analytics/download/statistics/types';
import { ADCHeader } from '@/components/adc/ADCHeader';
import { ADCMission } from '@/components/adc/ADCMission';
import { ADCSubmission } from '@/components/adc/ADCSubmission';
import { ChaptersGrid } from '@/components/atlas/ChaptersGrid';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const logger = createLogger('ADCPage');

const ADC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Track page view
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

  const handleExploreClick = () => {
    const contentSection = document.getElementById('adc-content');
    if (contentSection) {
      const yOffset = -80; // Adjust based on navbar height
      const y = contentSection.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

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
                <BreadcrumbPage>Atlas des Décisions Cliniques</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <ADCHeader />

          <section className="relative py-12 md:py-24 bg-white rounded-lg shadow-md overflow-hidden mt-8">
            <div className="absolute inset-0 bg-secondary/5 z-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0% 100%)' }}></div>
            <div className="relative z-10 px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl leading-tight">
                  Atlas des Décisions Cliniques
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  Explorez des recommandations cliniques fondées sur des preuves pour améliorer la prise de décision médicale.
                </p>
                <Button
                  size="lg"
                  className="mt-8 bg-secondary hover:bg-secondary-light text-white"
                  onClick={handleExploreClick}
                >
                  Explorer le contenu <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </section>

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
