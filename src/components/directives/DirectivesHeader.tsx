import { ArrowLeft, FileText, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DirectivesHeaderProps {
  title?: string;
  description?: string;
  backLink?: string;
  backText?: string;
}

export const DirectivesHeader = ({ 
  title = "Guide pour les auteurs RHCA",
  description = "La RHCA d'info CHIR reçoit l'envoi d'articles à caractère clinique, expérimental, culturel, historique pertinents avec des thèmes chirurgicaux et anesthésiologiques.",
  backLink = "/rhca",
  backText = "Retour à RHCA"
}: DirectivesHeaderProps) => {
  return (
    <>
      <Link to={backLink} className="inline-block mb-8">
        <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-secondary-light">
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Button>
      </Link>

      <div className="text-center mb-12 animate-fade-up">
        <FileText className="h-16 w-16 mx-auto mb-6 text-secondary" />
        <h1 className="text-4xl font-bold text-secondary mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          {description}
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