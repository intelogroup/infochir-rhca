
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LazyImage = lazy(() => import("./LazyImage"));

const LoadingSkeleton = () => (
  <Skeleton className="h-28 w-28 rounded-full" />
);

export const ADCHeader = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Link to="/" className="absolute left-4 top-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-5 w-5" />
            Retour
          </Button>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <Suspense fallback={<LoadingSkeleton />}>
              <LazyImage 
                src="/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
                alt="Atlas ADC Logo"
                className="h-28 w-28 object-contain"
              />
            </Suspense>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
              Atlas de Diagnostic Chirurgical
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une ressource visuelle complète pour le diagnostic chirurgical, conçue pour les professionnels de santé.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
