import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const RHCAHero = () => {
  return (
    <div className="relative bg-gradient-to-b from-primary/5 to-background pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-6">
            Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Une plateforme dédiée à l'avancement des connaissances en chirurgie et anesthésiologie, 
            offrant des perspectives uniques sur les pratiques médicales en Haïti.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/submission">Soumettre un article</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="#latest">Derniers articles</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};