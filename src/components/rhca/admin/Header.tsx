import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Header = () => {
  return (
    <div className="text-center mb-12">
      <Link to="/" className="inline-block mb-8">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </Link>

      <img 
        src="/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
        alt="RHCA Logo"
        className="h-24 w-24 mx-auto mb-6"
      />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Revue Haïtienne de Chirurgie et d'Anesthésiologie
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Plateforme de publication scientifique dédiée à la chirurgie et l'anesthésiologie.
      </p>
    </div>
  );
};