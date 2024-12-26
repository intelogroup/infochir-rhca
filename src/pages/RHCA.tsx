import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { IssuesGrid } from "@/components/issues/IssuesGrid";
import { Footer } from "@/components/Footer";

const RHCA = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>

        <div className="text-center mb-12 animate-fade-up">
          <img 
            src="/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
            alt="RHCA Logo"
            className="h-24 w-24 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-primary mb-4">
            Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une publication scientifique dédiée à l'avancement de la chirurgie et de l'anesthésiologie en Haïti.
          </p>
        </div>

        <IssuesGrid />

        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-primary mb-4">Notre Mission</h2>
            <p className="text-gray-600">
              La Revue Haïtienne de Chirurgie et d'Anesthésiologie est une publication scientifique 
              qui vise à promouvoir et à diffuser les connaissances dans les domaines de la chirurgie 
              et de l'anesthésiologie en Haïti. Notre mission est de fournir une plateforme pour 
              partager les avancées, les innovations et les meilleures pratiques dans ces domaines 
              cruciaux de la médecine.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RHCA;