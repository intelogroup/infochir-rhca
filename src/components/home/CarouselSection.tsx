
import {
  Carousel,
  CarouselContent,
  CarouselItem as CarouselItemUI,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { highlights } from "@/components/home/carousel/carouselData";
import { CarouselCard } from "@/components/home/carousel/CarouselCard";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, AlertTriangle, RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "framer-motion";
import { CarouselModal, CarouselItem } from "@/components/home/carousel/CarouselModal";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('CarouselSection');

export const CarouselSection = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CarouselItem | null>(null);
  const intervalRef = useRef<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  const { data: carouselData, isLoading, error, refetch } = useQuery({
    queryKey: ['carousel-highlights'],
    queryFn: async () => {
      logger.debug('Fetching carousel highlights for IGM, RHCA, and ADC sources...');
      
      // Get the latest article from each source (IGM, RHCA, ADC)
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .in('source', ['IGM', 'RHCA', 'ADC'])
        .order('publication_date', { ascending: false });

      if (error) throw error;

      if (!articles || articles.length === 0) {
        logger.debug('No articles found, falling back to highlights');
        return highlights;
      }

      // Group by source to get the latest of each
      const sourceMap = new Map();
      
      articles.forEach(article => {
        const source = article.source;
        if (!sourceMap.has(source)) {
          sourceMap.set(source, article);
        }
      });
      
      // Convert map to array of latest articles (one per source)
      const latestArticles = Array.from(sourceMap.values());
      
      logger.debug(`Found ${latestArticles.length} latest articles from specified sources`);

      return latestArticles.map(article => ({
        title: article.title,
        description: article.abstract,
        image: article.image_url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
        date: new Date(article.publication_date).toLocaleDateString('fr-FR'),
        category: article.source,
        author: article.authors ? article.authors.join(', ') : undefined,
        link: `/articles/${article.id}`,
      })) || highlights;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      // Reset the autoplay timer when manually changing slides
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        if (autoPlay) {
          startAutoPlay();
        }
      }
    });
    
    return () => {
      api.off("select");
    };
  }, [api, autoPlay]);

  // Start/stop autoplay when in view
  useEffect(() => {
    if (isInView && api) {
      setAutoPlay(true);
      startAutoPlay();
    } else if (!isInView && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isInView, api]);

  const startAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(() => {
      if (api) {
        api.scrollNext();
      }
    }, 5000) as unknown as number;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Select an item for the modal
  const handleItemSelect = (item: CarouselItem, index: number) => {
    setSelectedItem(item);
    setCurrent(index);
    setModalOpen(true);
    setAutoPlay(false); // Pause autoplay when modal is open
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Close the modal
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
    
    if (isInView) {
      setAutoPlay(true);
      startAutoPlay();
    }
  };

  // Navigate to the next item in the modal
  const handleNext = () => {
    if (!carouselData) return;
    const nextIndex = (current + 1) % carouselData.length;
    setCurrent(nextIndex);
    setSelectedItem(carouselData[nextIndex]);
    api?.scrollTo(nextIndex);
  };

  // Navigate to the previous item in the modal
  const handlePrevious = () => {
    if (!carouselData) return;
    const prevIndex = (current - 1 + carouselData.length) % carouselData.length;
    setCurrent(prevIndex);
    setSelectedItem(carouselData[prevIndex]);
    api?.scrollTo(prevIndex);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    logger.error('Error fetching carousel data:', error);
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                  Une erreur est survenue lors du chargement des articles.
                </AlertDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Réessayer
            </Button>
          </Alert>
        </div>
      </section>
    );
  }

  const displayData = carouselData || highlights;

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#41b06e] to-[#41b06e] opacity-5" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold bg-gradient-to-r from-[#1E40AF] via-[#41b06e] to-[#41b06e] bg-clip-text text-transparent mb-4"
          >
            À la Une
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Découvrez les dernières publications de nos revues
          </motion.p>
        </div>

        <Carousel
          opts={{ 
            align: "start", 
            loop: true,
          }}
          setApi={setApi}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="py-4">
            {displayData.map((highlight, index) => (
              <CarouselItemUI key={index} className="md:basis-1/2 lg:basis-1/3 h-[400px]">
                <div className="h-full" onClick={() => handleItemSelect(highlight, index)}>
                  <CarouselCard highlight={highlight} index={index} />
                </div>
              </CarouselItemUI>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16 h-12 w-12 border-2 border-primary/20 bg-white/80 hover:bg-white">
            <ChevronLeft className="h-6 w-6 text-primary" />
          </CarouselPrevious>
          <CarouselNext className="hidden md:flex -right-12 lg:-right-16 h-12 w-12 border-2 border-primary/20 bg-white/80 hover:bg-white">
            <ChevronRight className="h-6 w-6 text-primary" />
          </CarouselNext>
        </Carousel>

        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {displayData.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                current === index ? "bg-primary w-4" : "bg-primary/20"
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>

      {/* Global modal for carousel items */}
      {selectedItem && (
        <CarouselModal
          item={selectedItem}
          isOpen={modalOpen}
          onClose={handleModalClose}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={displayData.length > 1}
          hasPrevious={displayData.length > 1}
        />
      )}
    </section>
  );
};
