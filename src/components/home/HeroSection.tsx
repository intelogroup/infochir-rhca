
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  return (
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[calc(80vh-4rem-30px)] pt-20 md:pt-28 z-0">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 z-10"
          style={{ 
            backgroundImage: `url(/lovable-uploads/2cdc7a00-de30-4d15-94b2-b43fde942709.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#41b06e] to-[#41b06e] opacity-70 z-20"
          style={{ 
            mixBlendMode: 'multiply',
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto text-left z-30">
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
