import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { IndexMedicusGrid } from "@/components/IndexMedicusGrid";
import { StatsSection } from "@/components/index-medicus/StatsSection";

const IndexMedicus = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1585435557343-3b092031a831")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.03'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>

        <div className="text-center mb-12 animate-fade-up">
          <img 
            src="/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
            alt="Index Medicus Logo"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Index Medicus
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Base de données médicale complète regroupant les publications, cas cliniques et diagnostics.
          </p>

          <StatsSection />
        </div>

        <IndexMedicusGrid />
      </div>
    </div>
  );
};

export default IndexMedicus;