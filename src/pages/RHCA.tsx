import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, User, Tag, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { RHCAArticlesGrid } from "@/components/rhca/RHCAArticlesGrid";

const RHCA = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>

        <div className="text-center mb-12 animate-fade-up">
          <img 
            src="/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
            alt="RHCA Logo"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Plateforme de publication scientifique dédiée à la chirurgie et l'anesthésiologie.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard 
              icon={BookOpen} 
              title="Publications" 
              value="1000+" 
            />
            <StatCard 
              icon={User} 
              title="Contributeurs" 
              value="200+" 
            />
            <StatCard 
              icon={Tag} 
              title="Spécialités" 
              value="25+" 
            />
            <StatCard 
              icon={Calendar} 
              title="Années d'Archives" 
              value="5+" 
            />
          </div>
        </div>

        <RHCAArticlesGrid />
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value }: { icon: any; title: string; value: string }) => (
  <div className="bg-white/95 backdrop-blur-xs rounded-xl p-6 border border-gray-100">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/5 rounded-lg">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default RHCA;