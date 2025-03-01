
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import LazyImage from "@/components/adc/LazyImage";

export const HeroSection = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  return (
    <section 
      ref={sectionRef} 
      className="relative px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[calc(100vh-4rem)] pt-20 md:pt-28"
    >
      {/* Background container */}
      <div className="absolute inset-0 w-full h-full">
        {/* Direct image tag for better visibility and debugging */}
        <img 
          src="/lovable-uploads/86c46dd1-7e7a-44bc-bbf5-e3727e954bb7.png"
          alt="Medical background" 
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ zIndex: 1 }}
          onError={(e) => {
            console.error("Hero image failed to load:", e);
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.style.backgroundColor = '#f0f0f0';
          }}
        />
        
        {/* Gradient overlay with reduced opacity for better image visibility */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1E40AF] via-[#41b06e] to-[#41b06e] opacity-60"
          style={{ 
            mixBlendMode: 'multiply',
            zIndex: 2,
          }}
        />
      </div>
      
      {/* Content with highest z-index */}
      <div className="relative max-w-7xl mx-auto text-left" style={{ zIndex: 10 }}>
        <div className="max-w-xl lg:max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-up tracking-tight md:whitespace-nowrap whitespace-normal">
            Votre espace scientifique<br className="md:hidden" /> en ligne
          </h1>
          <p className="text-base sm:text-lg text-white/90 mb-8 animate-fade-up leading-relaxed">
            La plateforme de référence pour les professionnels de santé en Haïti
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="group bg-white hover:bg-white/90 text-[#122db0] font-medium"
              onClick={() => navigate('/submission')}
            >
              Soumettre votre article
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              className="bg-transparent hover:bg-white/10 text-white border-white border"
              onClick={() => navigate('/about')}
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
