import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RHCA = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-6">
            Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Une plateforme dédiée à l'avancement des connaissances en chirurgie et anesthésiologie
          </p>
          <Link to="/submission">
            <Button className="bg-primary text-white hover:bg-primary/90">
              Soumettre un article <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Publication Scientifique</h3>
            <p className="text-muted-foreground">
              Publiez vos recherches et contribuez à l'avancement de la chirurgie et de l'anesthésiologie.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Revue par les Pairs</h3>
            <p className="text-muted-foreground">
              Processus rigoureux d'évaluation pour garantir la qualité des publications.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Visibilité Internationale</h3>
            <p className="text-muted-foreground">
              Diffusion de vos travaux auprès de la communauté médicale internationale.
            </p>
          </div>
        </section>

        {/* Submission Section */}
        <section className="text-center bg-accent p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Prêt à Contribuer?</h2>
          <p className="mb-6 text-muted-foreground">
            Partagez vos recherches avec la communauté médicale et contribuez à l'avancement de la science.
          </p>
          <Link to="/submission">
            <Button variant="default">
              Commencer une Soumission
            </Button>
          </Link>
        </section>
      </div>
    </MainLayout>
  );
};

export default RHCA;