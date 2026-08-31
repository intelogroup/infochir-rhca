import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DirectivesHeaderProps {
  title?: string;
  description?: string;
  backLink?: string;
  backText?: string;
}

export const DirectivesHeader = ({
  title = "Guide pour les auteurs RHCA",
  description = "La RHCA d'Info CHIR reçoit l'envoi d'articles à caractère clinique, expérimental, culturel ou historique, pertinents avec des thèmes chirurgicaux et anesthésiologiques.",
  backLink = "/rhca",
  backText = "Retour à RHCA",
}: DirectivesHeaderProps) => {
  return (
    <header className="mb-12 space-y-4">
      <Link to={backLink} className="inline-block">
        <Button variant="ghost" size="sm" className="gap-2 -ml-3 text-primary">
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Button>
      </Link>

      <h1 className="type-display text-foreground">{title}</h1>
      <div className="rule-gold" />
      <p className="type-lead max-w-3xl">{description}</p>

      <div className="flex flex-col gap-2 pt-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
        <a
          href="mailto:infochir@gmail.com"
          className="flex items-center gap-2 transition-colors hover:text-primary"
        >
          <Mail className="h-4 w-4" />
          infochir@gmail.com
        </a>
        <a
          href="tel:+50947355350"
          className="flex items-center gap-2 transition-colors hover:text-primary"
        >
          <Phone className="h-4 w-4" />
          +509 47355350
        </a>
        <span>30 Rue Camille Léon, Port-au-Prince, Haïti</span>
      </div>
    </header>
  );
};
