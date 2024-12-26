import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroContent = () => {
  return (
    <div className="relative max-w-7xl mx-auto text-left">
      <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 animate-fade-up tracking-tight">
        Votre espace scientifique en ligne
      </h1>
      <p className="text-xl text-white/90 max-w-2xl mb-10 animate-fade-up leading-relaxed">
        La plateforme de référence pour les professionnels de santé en Haïti
      </p>
      <div className="flex flex-wrap gap-4">
        <Button size="lg" variant="secondary" className="group bg-green-800 hover:bg-green-900 text-white">
          Soumettre votre article
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button 
          size="lg" 
          className="bg-transparent hover:bg-white/10 text-white border-white border"
        >
          En savoir plus
        </Button>
      </div>
    </div>
  );
};