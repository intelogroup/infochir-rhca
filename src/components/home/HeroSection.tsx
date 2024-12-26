import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90" />
      <div className="absolute inset-0 bg-[url('/lovable-uploads/3686281a-0f1a-46e8-a03f-c56d49e3d791.png')] bg-cover bg-center opacity-50 mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
      
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 animate-fade-up tracking-tight [text-wrap:balance]">
          Votre espace scientifique{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            en ligne
          </span>
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12 animate-fade-up leading-relaxed [text-wrap:balance]">
          La plateforme de référence pour les professionnels de santé en Haïti
        </p>
        <div className="flex flex-wrap justify-center gap-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <Button 
            size="lg" 
            variant="secondary" 
            className="group relative overflow-hidden bg-white hover:bg-white/90 transition-colors"
          >
            <span className="relative z-10 flex items-center text-primary">
              Soumettre votre article
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
          <Button 
            size="lg" 
            className="group relative overflow-hidden bg-transparent hover:bg-white/10 text-white border-white border transition-colors"
          >
            En savoir plus
          </Button>
        </div>
      </div>
    </section>
  );
};