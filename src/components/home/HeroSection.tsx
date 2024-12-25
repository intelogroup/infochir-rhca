import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90" />
      <div className="absolute inset-0 bg-[url('/lovable-uploads/3686281a-0f1a-46e8-a03f-c56d49e3d791.png')] bg-cover bg-center opacity-10" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 animate-fade-up tracking-tight leading-tight">
            Votre espace scientifique<br />
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              en ligne
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed">
            La plateforme de référence pour les professionnels de santé en Haïti
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="group bg-white text-primary hover:bg-white/90"
            >
              Soumettre votre article
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              className="bg-transparent hover:bg-white/10 text-white border-white border-2"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};