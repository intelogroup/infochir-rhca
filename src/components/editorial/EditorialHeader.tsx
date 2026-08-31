import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EditorialHeaderProps {
  title?: string;
  description?: string;
  backLink?: string;
  backText?: string;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  title = "Comité éditorial",
  description = "Notre comité éditorial est composé d'experts reconnus dans leurs domaines respectifs, garantissant la qualité et la pertinence des publications.",
  backLink,
  backText,
}) => (
  <header className="mb-16 space-y-4">
    {backLink && backText && (
      <Link to={backLink} className="inline-block">
        <Button variant="ghost" size="sm" className="-ml-3 gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Button>
      </Link>
    )}

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <h1 className="type-display text-foreground">{title}</h1>
      <div className="rule-gold" />
      <p className="type-lead max-w-3xl">{description}</p>
    </motion.div>
  </header>
);
