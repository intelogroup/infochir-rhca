
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditorialHeaderProps {
  title?: string;
  description?: string;
  backLink?: string;
  backText?: string;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({ 
  title = "Comité Éditorial",
  description = "Notre comité éditorial est composé d'experts reconnus dans leurs domaines respectifs, garantissant la qualité et la pertinence des publications.",
  backLink,
  backText
}) => (
  <div className="mb-16">
    {backLink && backText && (
      <Link to={backLink} className="inline-block mb-8">
        <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light">
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Button>
      </Link>
    )}

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden mb-12"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <div className="flex items-start gap-4">
        <Users className="h-10 w-10 text-primary mt-1 flex-shrink-0" />
        <div>
          <h1 className="text-3xl font-bold text-primary mb-4">{title}</h1>
          <p className="text-lg text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  </div>
);
