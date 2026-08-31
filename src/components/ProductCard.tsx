import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ProductFeatures } from "./product/ProductFeatures";

interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  logo?: string;
  features?: string[];
  fullName?: string;
  link?: string;
}

const DEFAULT_FEATURES: Record<string, string[]> = {
  RHCA: ["Comité de lecture", "Articles originaux", "Archives complètes"],
  IGM: ["Actualités du milieu", "Éditoriaux", "Parution régulière"],
  "Atlas ADC": ["24 chapitres", "Iconographie clinique", "Consultable en ligne"],
  "Index Medicus": ["Par auteur", "Par titre et thème", "Références haïtiennes"],
};

const FULL_NAMES: Record<string, string> = {
  RHCA: "Revue Haïtienne de Chirurgie et d'Anesthésiologie",
  IGM: "Info Gazette Médicale",
  "Atlas ADC": "Atlas de Diagnostic Chirurgical",
  "Index Medicus": "Index Medicus",
};

export const ProductCard = ({
  title,
  icon,
  href,
  onClick,
  logo,
  features = [],
  fullName,
  link,
}: ProductCardProps) => {
  const Icon = icon;
  const resolvedFeatures = DEFAULT_FEATURES[title] ?? features;
  const name = fullName ?? FULL_NAMES[title] ?? title;

  const CardComponent = () => (
    <Card className="group h-full flex flex-col rounded-lg border border-border bg-card p-6 text-left shadow-none transition-colors duration-200 hover:border-primary/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-border bg-background">
          {logo ? (
            <img src={logo} alt={`Logo ${title}`} className="h-9 w-auto object-contain" loading="lazy" />
          ) : (
            <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
          )}
        </div>
        <span className="type-eyebrow pt-1">{title}</span>
      </div>

      <h3 className="mt-5 font-serif text-lg leading-snug text-foreground">{name}</h3>
      <div className="mt-4 h-px w-full bg-border" />

      <div className="mt-4 flex-grow">
        <ProductFeatures features={resolvedFeatures} />
      </div>

      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
        Découvrir
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Card>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="block h-full w-full text-left">
        <CardComponent />
      </button>
    );
  }
  return (
    <Link to={href || link || "#"} className="block h-full w-full">
      <CardComponent />
    </Link>
  );
};
