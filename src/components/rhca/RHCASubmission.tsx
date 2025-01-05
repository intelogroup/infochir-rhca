import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const RHCASubmission = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 animate-fade-up">
            Prêt à contribuer ?
          </h2>
          <p className="text-lg mb-8 opacity-90 animate-fade-up delay-100">
            Soumettez votre article et participez à l'avancement de la recherche médicale en Haïti
          </p>
          <div className="animate-fade-up delay-200">
            <Link to="/submission">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Soumettre votre article
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};