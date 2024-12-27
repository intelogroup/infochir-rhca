import { ArrowLeft, FileText, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DirectivesHeader = () => {
  return (
    <>
      <Link to="/rhca" className="inline-block mb-8">
        <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-secondary-light">
          <ArrowLeft className="h-4 w-4" />
          Retour à RHCA
        </Button>
      </Link>

      <div className="text-center mb-12 animate-fade-up">
        <FileText className="h-16 w-16 mx-auto mb-6 text-secondary" />
        <h1 className="text-4xl font-bold text-secondary mb-4">
          Guide pour les auteurs RHCA
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          La RHCA d'info CHIR reçoit l'envoi d'articles à caractère clinique, expérimental, culturel, historique pertinents avec des thèmes chirurgicaux et anesthésiologiques.
        </p>
        <div className="flex items-center justify-center gap-6 text-gray-600 mt-4">
          <a href="mailto:infochir@gmail.com" className="flex items-center gap-2 hover:text-secondary transition-colors">
            <Mail className="h-4 w-4" />
            infochir@gmail.com
          </a>
          <a href="tel:+50947355350" className="flex items-center gap-2 hover:text-secondary transition-colors">
            <Phone className="h-4 w-4" />
            +509 47355350
          </a>
        </div>
        <p className="text-gray-600 mt-4">
          30 Rue Camille Léon, Port-au-Prince, HAITI
        </p>
      </div>
    </>
  );
};