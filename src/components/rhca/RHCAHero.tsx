import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const RHCAHero = () => {
  return (
    <section className="relative py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 animate-fade-up">
            Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-lg text-gray-600 mb-8 animate-fade-up delay-100">
            Publiez vos articles scientifiques et contribuez à l'avancement des connaissances en chirurgie et anesthésiologie
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up delay-200">
            <Link to="/submission">
              <Button size="lg" className="bg-primary hover:bg-primary-light">
                Soumettre un article
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};