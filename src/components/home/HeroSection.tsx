import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90" />
      <div className="absolute inset-0 bg-[url('/lovable-uploads/3686281a-0f1a-46e8-a03f-c56d49e3d791.png')] bg-cover bg-center opacity-10" />
      
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 animate-fade-up tracking-tight">
            Votre espace scientifique en ligne
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 mb-10 animate-fade-up leading-relaxed">
            La plateforme de référence pour les professionnels de santé en Haïti
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Button size="lg" variant="secondary" className="group">
              Soumettre votre article
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              En savoir plus
            </Button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 max-w-lg">
          <img 
            src="/lovable-uploads/c2887190-a8a5-4f96-9268-79835f4cd5b6.png" 
            alt="Medical professional reviewing data"
            className="rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
          />
          <img 
            src="/lovable-uploads/a7d3e225-a6f7-4502-b77f-a4ef7c51b191.png"
            alt="Doctor using digital tablet"
            className="rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 mt-8"
          />
        </div>
      </div>
    </section>
  );
};